using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MembersParams membersParams)
    {
        var query = context.Members.AsQueryable();

        query = query.Where(x => x.Id != membersParams.CurrentMemberId);

        if (membersParams.Gender != null)
        {
            query = query.Where(x => x.Gender == membersParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-membersParams.MaxAge - 1));

        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-membersParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = membersParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginatedHelper.CreateAsync(query, membersParams.PageNumber, membersParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members
            .Where(x => x.Id == memberId)
            .SelectMany(x => x.Photos)
            .ToListAsync();
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
