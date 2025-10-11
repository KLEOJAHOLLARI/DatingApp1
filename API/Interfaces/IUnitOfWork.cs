using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository MemberRepository { get; }
    IMessagesRepository MessagesRepository { get; }
    ILikesRepository LikesRepository { get; }

    Task<bool> Complete();
    bool HasChanges();
}
