var TC = Object.defineProperty,
  xC = Object.defineProperties;
var NC = Object.getOwnPropertyDescriptors;
var Jm = Object.getOwnPropertySymbols;
var AC = Object.prototype.hasOwnProperty,
  RC = Object.prototype.propertyIsEnumerable;
var Xm = (e, t, n) =>
    t in e
      ? TC(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  b = (e, t) => {
    for (var n in (t ||= {})) AC.call(t, n) && Xm(e, n, t[n]);
    if (Jm) for (var n of Jm(t)) RC.call(t, n) && Xm(e, n, t[n]);
    return e;
  },
  B = (e, t) => xC(e, NC(t));
var Uo = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
    ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] })
    : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var xd;
function Oa() {
  return xd;
}
function Mn(e) {
  let t = xd;
  return (xd = e), t;
}
var eg = Symbol("NotFound");
function Bo(e) {
  return e === eg || e?.name === "\u0275NotFound";
}
function ja(e, t) {
  return Object.is(e, t);
}
var at = null,
  Pa = !1,
  Nd = 1,
  kC = null,
  Xe = Symbol("SIGNAL");
function z(e) {
  let t = at;
  return (at = e), t;
}
function Ua() {
  return at;
}
var Zr = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Yr(e) {
  if (Pa) throw new Error("");
  if (at === null) return;
  at.consumerOnSignalRead(e);
  let t = at.producersTail;
  if (t !== void 0 && t.producer === e) return;
  let n,
    r = at.recomputing;
  if (
    r &&
    ((n = t !== void 0 ? t.nextProducer : at.producers),
    n !== void 0 && n.producer === e)
  ) {
    (at.producersTail = n), (n.lastReadVersion = e.version);
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === at && (!r || PC(o, at))) return;
  let i = zo(at),
    s = {
      producer: e,
      consumer: at,
      nextProducer: n,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  (at.producersTail = s),
    t !== void 0 ? (t.nextProducer = s) : (at.producers = s),
    i && ng(e, s);
}
function tg() {
  Nd++;
}
function Ba(e) {
  if (!(zo(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Nd)) {
    if (!e.producerMustRecompute(e) && !$o(e)) {
      Va(e);
      return;
    }
    e.producerRecomputeValue(e), Va(e);
  }
}
function Ad(e) {
  if (e.consumers === void 0) return;
  let t = Pa;
  Pa = !0;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || OC(r);
    }
  } finally {
    Pa = t;
  }
}
function Rd() {
  return at?.consumerAllowSignalWrites !== !1;
}
function OC(e) {
  (e.dirty = !0), Ad(e), e.consumerMarkedDirty?.(e);
}
function Va(e) {
  (e.dirty = !1), (e.lastCleanEpoch = Nd);
}
function Qr(e) {
  return e && ((e.producersTail = void 0), (e.recomputing = !0)), z(e);
}
function Ho(e, t) {
  if ((z(t), !e)) return;
  e.recomputing = !1;
  let n = e.producersTail,
    r = n !== void 0 ? n.nextProducer : e.producers;
  if (r !== void 0) {
    if (zo(e))
      do r = kd(r);
      while (r !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (e.producers = void 0);
  }
}
function $o(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (Ba(n), r !== n.version)) return !0;
  }
  return !1;
}
function Kr(e) {
  if (zo(e)) {
    let t = e.producers;
    for (; t !== void 0; ) t = kd(t);
  }
  (e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0);
}
function ng(e, t) {
  let n = e.consumersTail,
    r = zo(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer)
      ng(o.producer, o);
}
function kd(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (t.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((t.consumers = r), !zo(t))) {
    let i = t.producers;
    for (; i !== void 0; ) i = kd(i);
  }
  return n;
}
function zo(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function Ha(e) {
  kC?.(e);
}
function PC(e, t) {
  let n = t.producersTail;
  if (n !== void 0) {
    let r = t.producers;
    do {
      if (r === e) return !0;
      if (r === n) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function $a(e, t) {
  let n = Object.create(FC);
  (n.computation = e), t !== void 0 && (n.equal = t);
  let r = () => {
    if ((Ba(n), Yr(n), n.value === Ki)) throw n.error;
    return n.value;
  };
  return (r[Xe] = n), Ha(n), r;
}
var Fa = Symbol("UNSET"),
  La = Symbol("COMPUTING"),
  Ki = Symbol("ERRORED"),
  FC = B(b({}, Zr), {
    value: Fa,
    dirty: !0,
    error: null,
    equal: ja,
    kind: "computed",
    producerMustRecompute(e) {
      return e.value === Fa || e.value === La;
    },
    producerRecomputeValue(e) {
      if (e.value === La) throw new Error("");
      let t = e.value;
      e.value = La;
      let n = Qr(e),
        r,
        o = !1;
      try {
        (r = e.computation()),
          z(null),
          (o = t !== Fa && t !== Ki && r !== Ki && e.equal(t, r));
      } catch (i) {
        (r = Ki), (e.error = i);
      } finally {
        Ho(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function LC() {
  throw new Error();
}
var rg = LC;
function og(e) {
  rg(e);
}
function Od(e) {
  rg = e;
}
var VC = null;
function Pd(e, t) {
  let n = Object.create(za);
  (n.value = e), t !== void 0 && (n.equal = t);
  let r = () => ig(n);
  return (r[Xe] = n), Ha(n), [r, (s) => Jr(n, s), (s) => Fd(n, s)];
}
function ig(e) {
  return Yr(e), e.value;
}
function Jr(e, t) {
  Rd() || og(e), e.equal(e.value, t) || ((e.value = t), jC(e));
}
function Fd(e, t) {
  Rd() || og(e), Jr(e, t(e.value));
}
var za = B(b({}, Zr), { equal: ja, value: void 0, kind: "signal" });
function jC(e) {
  e.version++, tg(), Ad(e), VC?.(e);
}
function K(e) {
  return typeof e == "function";
}
function Go(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Ga = Go(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Xr(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var Ie = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (K(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Ga ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            sg(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Ga ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Ga(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) sg(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Xr(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Xr(n, t), t instanceof e && t._removeParent(this);
  }
};
Ie.EMPTY = (() => {
  let e = new Ie();
  return (e.closed = !0), e;
})();
var Ld = Ie.EMPTY;
function Wa(e) {
  return (
    e instanceof Ie ||
    (e && "closed" in e && K(e.remove) && K(e.add) && K(e.unsubscribe))
  );
}
function sg(e) {
  K(e) ? e() : e.unsubscribe();
}
var hn = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Wo = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Wo;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Wo;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function qa(e) {
  Wo.setTimeout(() => {
    let { onUnhandledError: t } = hn;
    if (t) t(e);
    else throw e;
  });
}
function eo() {}
var ag = Vd("C", void 0, void 0);
function cg(e) {
  return Vd("E", void 0, e);
}
function lg(e) {
  return Vd("N", e, void 0);
}
function Vd(e, t, n) {
  return { kind: e, value: t, error: n };
}
var to = null;
function qo(e) {
  if (hn.useDeprecatedSynchronousErrorHandling) {
    let t = !to;
    if ((t && (to = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = to;
      if (((to = null), n)) throw r;
    }
  } else e();
}
function ug(e) {
  hn.useDeprecatedSynchronousErrorHandling &&
    to &&
    ((to.errorThrown = !0), (to.error = e));
}
var no = class extends Ie {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Wa(t) && t.add(this))
          : (this.destination = HC);
    }
    static create(t, n, r) {
      return new Zo(t, n, r);
    }
    next(t) {
      this.isStopped ? Ud(lg(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Ud(cg(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Ud(ag, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  UC = Function.prototype.bind;
function jd(e, t) {
  return UC.call(e, t);
}
var Bd = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Za(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Za(r);
        }
      else Za(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Za(n);
        }
    }
  },
  Zo = class extends no {
    constructor(t, n, r) {
      super();
      let o;
      if (K(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && hn.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && jd(t.next, i),
              error: t.error && jd(t.error, i),
              complete: t.complete && jd(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Bd(o);
    }
  };
function Za(e) {
  hn.useDeprecatedSynchronousErrorHandling ? ug(e) : qa(e);
}
function BC(e) {
  throw e;
}
function Ud(e, t) {
  let { onStoppedNotification: n } = hn;
  n && Wo.setTimeout(() => n(e, t));
}
var HC = { closed: !0, next: eo, error: BC, complete: eo };
var Yo = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ct(e) {
  return e;
}
function Hd(...e) {
  return $d(e);
}
function $d(e) {
  return e.length === 0
    ? ct
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var te = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = zC(n) ? n : new Zo(n, r, o);
      return (
        qo(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = dg(r)),
        new r((o, i) => {
          let s = new Zo({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Yo]() {
      return this;
    }
    pipe(...n) {
      return $d(n)(this);
    }
    toPromise(n) {
      return (
        (n = dg(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function dg(e) {
  var t;
  return (t = e ?? hn.Promise) !== null && t !== void 0 ? t : Promise;
}
function $C(e) {
  return e && K(e.next) && K(e.error) && K(e.complete);
}
function zC(e) {
  return (e && e instanceof no) || ($C(e) && Wa(e));
}
function zd(e) {
  return K(e?.lift);
}
function re(e) {
  return (t) => {
    if (zd(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function ne(e, t, n, r, o) {
  return new Gd(e, t, n, r, o);
}
var Gd = class extends no {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function Qo() {
  return re((e, t) => {
    let n = null;
    e._refCount++;
    let r = ne(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var Ko = class extends te {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      zd(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new Ie();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          ne(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = Ie.EMPTY));
    }
    return t;
  }
  refCount() {
    return Qo()(this);
  }
};
var fg = Go(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var Ae = (() => {
    class e extends te {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Ya(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new fg();
      }
      next(n) {
        qo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        qo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        qo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Ld
          : ((this.currentObservers = null),
            i.push(n),
            new Ie(() => {
              (this.currentObservers = null), Xr(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new te();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new Ya(t, n)), e;
  })(),
  Ya = class extends Ae {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Ld;
    }
  };
var et = class extends Ae {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Wd = {
  now() {
    return (Wd.delegate || Date).now();
  },
  delegate: void 0,
};
var Qa = class extends Ie {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var Ji = {
  setInterval(e, t, ...n) {
    let { delegate: r } = Ji;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = Ji;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Ka = class extends Qa {
  constructor(t, n) {
    super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1);
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return Ji.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && Ji.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      o;
    try {
      this.work(t);
    } catch (i) {
      (r = !0), (o = i || new Error("Scheduled action threw falsy error"));
    }
    if (r) return this.unsubscribe(), o;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Xr(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Jo = class e {
  constructor(t, n = e.now) {
    (this.schedulerActionCtor = t), (this.now = n);
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
Jo.now = Wd.now;
var Ja = class extends Jo {
  constructor(t, n = Jo.now) {
    super(t, n), (this.actions = []), (this._active = !1);
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var qd = new Ja(Ka),
  pg = qd;
var lt = new te((e) => e.complete());
function Xa(e) {
  return e && K(e.schedule);
}
function hg(e) {
  return e[e.length - 1];
}
function ec(e) {
  return K(hg(e)) ? e.pop() : void 0;
}
function gr(e) {
  return Xa(hg(e)) ? e.pop() : void 0;
}
function gg(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function mg(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function ro(e) {
  return this instanceof ro ? ((this.v = e), this) : new ro(e);
}
function vg(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(p) {
    return function (C) {
      return Promise.resolve(C).then(p, d);
    };
  }
  function a(p, C) {
    r[p] &&
      ((o[p] = function (N) {
        return new Promise(function (T, x) {
          i.push([p, N, T, x]) > 1 || c(p, N);
        });
      }),
      C && (o[p] = C(o[p])));
  }
  function c(p, C) {
    try {
      l(r[p](C));
    } catch (N) {
      g(i[0][3], N);
    }
  }
  function l(p) {
    p.value instanceof ro
      ? Promise.resolve(p.value.v).then(u, d)
      : g(i[0][2], p);
  }
  function u(p) {
    c("next", p);
  }
  function d(p) {
    c("throw", p);
  }
  function g(p, C) {
    p(C), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function yg(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof mg == "function" ? mg(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var tc = (e) => e && typeof e.length == "number" && typeof e != "function";
function nc(e) {
  return K(e?.then);
}
function rc(e) {
  return K(e[Yo]);
}
function oc(e) {
  return Symbol.asyncIterator && K(e?.[Symbol.asyncIterator]);
}
function ic(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function GC() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var sc = GC();
function ac(e) {
  return K(e?.[sc]);
}
function cc(e) {
  return vg(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield ro(n.read());
        if (o) return yield ro(void 0);
        yield yield ro(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function lc(e) {
  return K(e?.getReader);
}
function Se(e) {
  if (e instanceof te) return e;
  if (e != null) {
    if (rc(e)) return WC(e);
    if (tc(e)) return qC(e);
    if (nc(e)) return ZC(e);
    if (oc(e)) return _g(e);
    if (ac(e)) return YC(e);
    if (lc(e)) return QC(e);
  }
  throw ic(e);
}
function WC(e) {
  return new te((t) => {
    let n = e[Yo]();
    if (K(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function qC(e) {
  return new te((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function ZC(e) {
  return new te((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, qa);
  });
}
function YC(e) {
  return new te((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function _g(e) {
  return new te((t) => {
    KC(e, t).catch((n) => t.error(n));
  });
}
function QC(e) {
  return _g(cc(e));
}
function KC(e, t) {
  var n, r, o, i;
  return gg(this, void 0, void 0, function* () {
    try {
      for (n = yg(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function Mt(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function uc(e, t = 0) {
  return re((n, r) => {
    n.subscribe(
      ne(
        r,
        (o) => Mt(r, e, () => r.next(o), t),
        () => Mt(r, e, () => r.complete(), t),
        (o) => Mt(r, e, () => r.error(o), t)
      )
    );
  });
}
function dc(e, t = 0) {
  return re((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function bg(e, t) {
  return Se(e).pipe(dc(t), uc(t));
}
function Cg(e, t) {
  return Se(e).pipe(dc(t), uc(t));
}
function Eg(e, t) {
  return new te((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Dg(e, t) {
  return new te((n) => {
    let r;
    return (
      Mt(n, t, () => {
        (r = e[sc]()),
          Mt(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => K(r?.return) && r.return()
    );
  });
}
function fc(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new te((n) => {
    Mt(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Mt(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function wg(e, t) {
  return fc(cc(e), t);
}
function Ig(e, t) {
  if (e != null) {
    if (rc(e)) return bg(e, t);
    if (tc(e)) return Eg(e, t);
    if (nc(e)) return Cg(e, t);
    if (oc(e)) return fc(e, t);
    if (ac(e)) return Dg(e, t);
    if (lc(e)) return wg(e, t);
  }
  throw ic(e);
}
function we(e, t) {
  return t ? Ig(e, t) : Se(e);
}
function V(...e) {
  let t = gr(e);
  return we(e, t);
}
function Xo(e, t) {
  let n = K(e) ? e : () => e,
    r = (o) => o.error(n());
  return new te(t ? (o) => t.schedule(r, 0, o) : r);
}
function Zd(e) {
  return !!e && (e instanceof te || (K(e.lift) && K(e.subscribe)));
}
var mn = Go(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Yd(e, t) {
  let n = typeof t == "object";
  return new Promise((r, o) => {
    let i = !1,
      s;
    e.subscribe({
      next: (a) => {
        (s = a), (i = !0);
      },
      error: o,
      complete: () => {
        i ? r(s) : n ? r(t.defaultValue) : o(new mn());
      },
    });
  });
}
function Sg(e) {
  return e instanceof Date && !isNaN(e);
}
function J(e, t) {
  return re((n, r) => {
    let o = 0;
    n.subscribe(
      ne(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: JC } = Array;
function XC(e, t) {
  return JC(t) ? e(...t) : e(t);
}
function pc(e) {
  return J((t) => XC(e, t));
}
var { isArray: eE } = Array,
  { getPrototypeOf: tE, prototype: nE, keys: rE } = Object;
function hc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (eE(t)) return { args: t, keys: null };
    if (oE(t)) {
      let n = rE(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function oE(e) {
  return e && typeof e == "object" && tE(e) === nE;
}
function mc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function gc(...e) {
  let t = gr(e),
    n = ec(e),
    { args: r, keys: o } = hc(e);
  if (r.length === 0) return we([], t);
  let i = new te(iE(r, t, o ? (s) => mc(o, s) : ct));
  return n ? i.pipe(pc(n)) : i;
}
function iE(e, t, n = ct) {
  return (r) => {
    Mg(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Mg(
            t,
            () => {
              let l = we(e[c], t),
                u = !1;
              l.subscribe(
                ne(
                  r,
                  (d) => {
                    (i[c] = d), u || ((u = !0), a--), a || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function Mg(e, t, n) {
  e ? Mt(n, e, t) : t();
}
function Tg(e, t, n, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    g = () => {
      d && !c.length && !l && t.complete();
    },
    p = (N) => (l < r ? C(N) : c.push(N)),
    C = (N) => {
      i && t.next(N), l++;
      let T = !1;
      Se(n(N, u++)).subscribe(
        ne(
          t,
          (x) => {
            o?.(x), i ? p(x) : t.next(x);
          },
          () => {
            T = !0;
          },
          void 0,
          () => {
            if (T)
              try {
                for (l--; c.length && l < r; ) {
                  let x = c.shift();
                  s ? Mt(t, s, () => C(x)) : C(x);
                }
                g();
              } catch (x) {
                t.error(x);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      ne(t, p, () => {
        (d = !0), g();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Me(e, t, n = 1 / 0) {
  return K(t)
    ? Me((r, o) => J((i, s) => t(r, i, o, s))(Se(e(r, o))), n)
    : (typeof t == "number" && (n = t), re((r, o) => Tg(r, o, e, n)));
}
function ei(e = 1 / 0) {
  return Me(ct, e);
}
function xg() {
  return ei(1);
}
function vr(...e) {
  return xg()(we(e, gr(e)));
}
function Xi(e) {
  return new te((t) => {
    Se(e()).subscribe(t);
  });
}
function Qd(...e) {
  let t = ec(e),
    { args: n, keys: r } = hc(e),
    o = new te((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        Se(n[u]).subscribe(
          ne(
            i,
            (g) => {
              d || ((d = !0), l--), (a[u] = g);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || i.next(r ? mc(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(pc(t)) : o;
}
function Ng(e = 0, t, n = pg) {
  let r = -1;
  return (
    t != null && (Xa(t) ? (n = t) : (r = t)),
    new te((o) => {
      let i = Sg(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed ||
          (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function We(e, t) {
  return re((n, r) => {
    let o = 0;
    n.subscribe(ne(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Jt(e) {
  return re((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      ne(n, void 0, void 0, (s) => {
        (i = Se(e(s, Jt(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      })
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function Ag(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      c = t,
      l = 0;
    i.subscribe(
      ne(
        s,
        (u) => {
          let d = l++;
          (c = a ? e(c, u, d) : ((a = !0), u)), r && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function Jn(e, t) {
  return K(t) ? Me(e, t, 1) : Me(e, 1);
}
function yr(e) {
  return re((t, n) => {
    let r = !1;
    t.subscribe(
      ne(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        }
      )
    );
  });
}
function Xt(e) {
  return e <= 0
    ? () => lt
    : re((t, n) => {
        let r = 0;
        t.subscribe(
          ne(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          })
        );
      });
}
function Rg() {
  return re((e, t) => {
    e.subscribe(ne(t, eo));
  });
}
function kg(e) {
  return J(() => e);
}
function Kd(e, t) {
  return t
    ? (n) => vr(t.pipe(Xt(1), Rg()), n.pipe(Kd(e)))
    : Me((n, r) => Se(e(n, r)).pipe(Xt(1), kg(n)));
}
function Jd(e, t = qd) {
  let n = Ng(e, t);
  return Kd(() => n);
}
function vc(e = sE) {
  return re((t, n) => {
    let r = !1;
    t.subscribe(
      ne(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e()))
      )
    );
  });
}
function sE() {
  return new mn();
}
function Tn(e) {
  return re((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Xn(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? We((o, i) => e(o, i, r)) : ct,
      Xt(1),
      n ? yr(t) : vc(() => new mn())
    );
}
function ti(e) {
  return e <= 0
    ? () => lt
    : re((t, n) => {
        let r = [];
        t.subscribe(
          ne(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function Xd(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? We((o, i) => e(o, i, r)) : ct,
      ti(1),
      n ? yr(t) : vc(() => new mn())
    );
}
function ef(e, t) {
  return re(Ag(e, t, arguments.length >= 2, !0));
}
function tf(...e) {
  let t = gr(e);
  return re((n, r) => {
    (t ? vr(e, n, t) : vr(e, n)).subscribe(r);
  });
}
function ut(e, t) {
  return re((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      ne(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          Se(e(c, u)).subscribe(
            (o = ne(
              r,
              (d) => r.next(t ? t(c, d, u, l++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function yc(e) {
  return re((t, n) => {
    Se(e).subscribe(ne(n, () => n.complete(), eo)), !n.closed && t.subscribe(n);
  });
}
function le(e, t, n) {
  let r = K(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? re((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          ne(
            i,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                i.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : ct;
}
function Og(e) {
  let t = z(null);
  try {
    return e();
  } finally {
    z(t);
  }
}
var Pg = B(b({}, Zr), {
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  dirty: !0,
  hasRun: !1,
  kind: "effect",
});
function Fg(e) {
  if (((e.dirty = !1), e.hasRun && !$o(e))) return;
  e.hasRun = !0;
  let t = Qr(e);
  try {
    e.cleanup(), e.fn();
  } finally {
    Ho(e, t);
  }
}
var Dc =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  D = class extends Error {
    code;
    constructor(t, n) {
      super(Cr(t, n)), (this.code = t);
    }
  };
function aE(e) {
  return `NG0${Math.abs(e)}`;
}
function Cr(e, t) {
  return `${aE(e)}${t ? ": " + t : ""}`;
}
var nr = globalThis;
function ae(e) {
  for (let t in e) if (e[t] === ae) return t;
  throw Error("");
}
function jg(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function tr(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(tr).join(", ")}]`;
  if (e == null) return "" + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return "" + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function pf(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || "";
}
var cE = ae({ __forward_ref__: ae });
function dt(e) {
  return (
    (e.__forward_ref__ = dt),
    (e.toString = function () {
      return tr(this());
    }),
    e
  );
}
function tt(e) {
  return hf(e) ? e() : e;
}
function hf(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(cE) && e.__forward_ref__ === dt
  );
}
function Ug(e, t) {
  e == null && mf(t, e, null, "!=");
}
function mf(e, t, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${e}` +
      (r == null ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
  );
}
function w(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function gn(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function is(e) {
  return lE(e, wc);
}
function gf(e) {
  return is(e) !== null;
}
function lE(e, t) {
  return (e.hasOwnProperty(t) && e[t]) || null;
}
function uE(e) {
  let t = e?.[wc] ?? null;
  return t || null;
}
function rf(e) {
  return e && e.hasOwnProperty(bc) ? e[bc] : null;
}
var wc = ae({ ɵprov: ae }),
  bc = ae({ ɵinj: ae }),
  M = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(t, n) {
      (this._desc = t),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = w({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function vf(e) {
  return e && !!e.ɵproviders;
}
var yf = ae({ ɵcmp: ae }),
  _f = ae({ ɵdir: ae }),
  bf = ae({ ɵpipe: ae }),
  Cf = ae({ ɵmod: ae }),
  ns = ae({ ɵfac: ae }),
  co = ae({ __NG_ELEMENT_ID__: ae }),
  Lg = ae({ __NG_ENV_ID__: ae });
function vn(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Cc(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : vn(e);
}
var Ef = ae({ ngErrorCode: ae }),
  Bg = ae({ ngErrorMessage: ae }),
  ts = ae({ ngTokenPath: ae });
function Df(e, t) {
  return Hg("", -200, t);
}
function Ic(e, t) {
  throw new D(-201, !1);
}
function dE(e, t) {
  e[ts] ??= [];
  let n = e[ts],
    r;
  typeof t == "object" && "multi" in t && t?.multi === !0
    ? (Ug(t.provide, "Token with multi: true should have a provide property"),
      (r = Cc(t.provide)))
    : (r = Cc(t)),
    n[0] !== r && e[ts].unshift(r);
}
function fE(e, t) {
  let n = e[ts],
    r = e[Ef],
    o = e[Bg] || e.message;
  return (e.message = hE(o, r, n, t)), e;
}
function Hg(e, t, n) {
  let r = new D(t, e);
  return (r[Ef] = t), (r[Bg] = e), n && (r[ts] = n), r;
}
function pE(e) {
  return e[Ef];
}
function hE(e, t, n = [], r = null) {
  let o = "";
  n && n.length > 1 && (o = ` Path: ${n.join(" -> ")}.`);
  let i = r ? ` Source: ${r}.` : "";
  return Cr(t, `${e}${i}${o}`);
}
var of;
function $g() {
  return of;
}
function mt(e) {
  let t = of;
  return (of = e), t;
}
function wf(e, t, n) {
  let r = is(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  Ic(e, "Injector");
}
var mE = {},
  oo = mE,
  gE = "__NG_DI_FLAG__",
  sf = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = io(n) || 0;
      try {
        return this.injector.get(t, r & 8 ? null : oo, r);
      } catch (o) {
        if (Bo(o)) return o;
        throw o;
      }
    }
  };
function vE(e, t = 0) {
  let n = Oa();
  if (n === void 0) throw new D(-203, !1);
  if (n === null) return wf(e, void 0, t);
  {
    let r = yE(t),
      o = n.retrieve(e, r);
    if (Bo(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function H(e, t = 0) {
  return ($g() || vE)(tt(e), t);
}
function f(e, t) {
  return H(e, io(t));
}
function io(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function yE(e) {
  return {
    optional: !!(e & 8),
    host: !!(e & 1),
    self: !!(e & 2),
    skipSelf: !!(e & 4),
  };
}
function af(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = tt(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new D(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = _E(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(H(o, i));
    } else t.push(H(r));
  }
  return t;
}
function _E(e) {
  return e[gE];
}
function _r(e, t) {
  let n = e.hasOwnProperty(ns);
  return n ? e[ns] : null;
}
function zg(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function Gg(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Sc(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Sc(n, t) : t(n)));
}
function If(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function ss(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Wg(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function qg(e, t, n) {
  let r = ri(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Wg(e, r, t, n)), r;
}
function Mc(e, t) {
  let n = ri(e, t);
  if (n >= 0) return e[n | 1];
}
function ri(e, t) {
  return bE(e, t, 1);
}
function bE(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Er = {},
  Ft = [],
  rr = new M(""),
  Sf = new M("", -1),
  Mf = new M(""),
  rs = class {
    get(t, n = oo) {
      if (n === oo) {
        let o = Hg("", -201);
        throw ((o.name = "\u0275NotFound"), o);
      }
      return n;
    }
  };
function Tf(e) {
  return e[Cf] || null;
}
function Dr(e) {
  return e[yf] || null;
}
function xf(e) {
  return e[_f] || null;
}
function Zg(e) {
  return e[bf] || null;
}
function xn(e) {
  return { ɵproviders: e };
}
function Yg(e) {
  return xn([{ provide: rr, multi: !0, useValue: e }]);
}
function Qg(...e) {
  return { ɵproviders: Nf(!0, e), ɵfromNgModule: !0 };
}
function Nf(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Sc(t, (s) => {
      let a = s;
      Ec(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Kg(o, i),
    n
  );
}
function Kg(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Af(o, (i) => {
      t(i, r);
    });
  }
}
function Ec(e, t, n, r) {
  if (((e = tt(e)), !e)) return !1;
  let o = null,
    i = rf(e),
    s = !i && Dr(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = rf(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) Ec(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        Sc(i.imports, (u) => {
          Ec(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Kg(l, t);
    }
    if (!a) {
      let l = _r(o) || (() => new o());
      t({ provide: o, useFactory: l, deps: Ft }, o),
        t({ provide: Mf, useValue: o, multi: !0 }, o),
        t({ provide: rr, useValue: () => H(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      Af(c, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Af(e, t) {
  for (let n of e)
    vf(n) && (n = n.ɵproviders), Array.isArray(n) ? Af(n, t) : t(n);
}
var CE = ae({ provide: String, useValue: ae });
function Jg(e) {
  return e !== null && typeof e == "object" && CE in e;
}
function EE(e) {
  return !!(e && e.useExisting);
}
function DE(e) {
  return !!(e && e.useFactory);
}
function so(e) {
  return typeof e == "function";
}
function Xg(e) {
  return !!e.useClass;
}
var as = new M(""),
  _c = {},
  Vg = {},
  nf;
function cs() {
  return nf === void 0 && (nf = new rs()), nf;
}
var je = class {},
  ao = class extends je {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        lf(t, (s) => this.processProvider(s)),
        this.records.set(Sf, ni(void 0, this)),
        o.has("environment") && this.records.set(je, ni(void 0, this));
      let i = this.records.get(as);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Mf, Ft, { self: !0 })));
    }
    retrieve(t, n) {
      let r = io(n) || 0;
      try {
        return this.get(t, oo, r);
      } catch (o) {
        if (Bo(o)) return o;
        throw o;
      }
    }
    destroy() {
      es(this), (this._destroyed = !0);
      let t = z(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          z(t);
      }
    }
    onDestroy(t) {
      return (
        es(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      es(this);
      let n = Mn(this),
        r = mt(void 0),
        o;
      try {
        return t();
      } finally {
        Mn(n), mt(r);
      }
    }
    get(t, n = oo, r) {
      if ((es(this), t.hasOwnProperty(Lg))) return t[Lg](this);
      let o = io(r),
        i,
        s = Mn(this),
        a = mt(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(t);
          if (l === void 0) {
            let u = TE(t) && is(t);
            u && this.injectableDefInScope(u)
              ? (l = ni(cf(t), _c))
              : (l = null),
              this.records.set(t, l);
          }
          if (l != null) return this.hydrate(t, l, o);
        }
        let c = o & 2 ? cs() : this.parent;
        return (n = o & 8 && n === oo ? null : n), c.get(t, n);
      } catch (c) {
        let l = pE(c);
        throw l === -200 || l === -201 ? new D(l, null) : c;
      } finally {
        mt(a), Mn(s);
      }
    }
    resolveInjectorInitializers() {
      let t = z(null),
        n = Mn(this),
        r = mt(void 0),
        o;
      try {
        let i = this.get(rr, Ft, { self: !0 });
        for (let s of i) s();
      } finally {
        Mn(n), mt(r), z(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(tr(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = tt(t);
      let n = so(t) ? t : tt(t && t.provide),
        r = IE(t);
      if (!so(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = ni(void 0, _c, !0)),
          (o.factory = () => af(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n, r) {
      let o = z(null);
      try {
        if (n.value === Vg) throw Df(tr(t));
        return (
          n.value === _c && ((n.value = Vg), (n.value = n.factory(void 0, r))),
          typeof n.value == "object" &&
            n.value &&
            ME(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        z(o);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = tt(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function cf(e) {
  let t = is(e),
    n = t !== null ? t.factory : _r(e);
  if (n !== null) return n;
  if (e instanceof M) throw new D(204, !1);
  if (e instanceof Function) return wE(e);
  throw new D(204, !1);
}
function wE(e) {
  if (e.length > 0) throw new D(204, !1);
  let n = uE(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function IE(e) {
  if (Jg(e)) return ni(void 0, e.useValue);
  {
    let t = Rf(e);
    return ni(t, _c);
  }
}
function Rf(e, t, n) {
  let r;
  if (so(e)) {
    let o = tt(e);
    return _r(o) || cf(o);
  } else if (Jg(e)) r = () => tt(e.useValue);
  else if (DE(e)) r = () => e.useFactory(...af(e.deps || []));
  else if (EE(e))
    r = (o, i) => H(tt(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = tt(e && (e.useClass || e.provide));
    if (SE(e)) r = () => new o(...af(e.deps));
    else return _r(o) || cf(o);
  }
  return r;
}
function es(e) {
  if (e.destroyed) throw new D(205, !1);
}
function ni(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function SE(e) {
  return !!e.deps;
}
function ME(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function TE(e) {
  return (
    typeof e == "function" ||
    (typeof e == "object" && e.ngMetadataName === "InjectionToken")
  );
}
function lf(e, t) {
  for (let n of e)
    Array.isArray(n) ? lf(n, t) : n && vf(n) ? lf(n.ɵproviders, t) : t(n);
}
function qe(e, t) {
  let n;
  e instanceof ao ? (es(e), (n = e)) : (n = new sf(e));
  let r,
    o = Mn(n),
    i = mt(void 0);
  try {
    return t();
  } finally {
    Mn(o), mt(i);
  }
}
function ev() {
  return $g() !== void 0 || Oa() != null;
}
var yn = 0,
  $ = 1,
  W = 2,
  He = 3,
  tn = 4,
  nn = 5,
  oi = 6,
  ii = 7,
  Re = 8,
  lo = 9,
  Nn = 10,
  be = 11,
  si = 12,
  kf = 13,
  uo = 14,
  Vt = 15,
  wr = 16,
  fo = 17,
  An = 18,
  ls = 19,
  Of = 20,
  er = 21,
  Tc = 22,
  or = 23,
  jt = 24,
  po = 25,
  Te = 26,
  tv = 1,
  Pf = 6,
  Ir = 7,
  us = 8,
  ho = 9,
  Ze = 10;
function Rn(e) {
  return Array.isArray(e) && typeof e[tv] == "object";
}
function _n(e) {
  return Array.isArray(e) && e[tv] === !0;
}
function Ff(e) {
  return (e.flags & 4) !== 0;
}
function Sr(e) {
  return e.componentOffset > -1;
}
function ds(e) {
  return (e.flags & 1) === 1;
}
function kn(e) {
  return !!e.template;
}
function ai(e) {
  return (e[W] & 512) !== 0;
}
function mo(e) {
  return (e[W] & 256) === 256;
}
var Lf = "svg",
  nv = "math";
function rn(e) {
  for (; Array.isArray(e); ) e = e[yn];
  return e;
}
function Vf(e, t) {
  return rn(t[e]);
}
function bn(e, t) {
  return rn(t[e.index]);
}
function fs(e, t) {
  return e.data[t];
}
function xc(e, t) {
  return e[t];
}
function jf(e, t, n, r) {
  n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r);
}
function on(e, t) {
  let n = t[e];
  return Rn(n) ? n : n[yn];
}
function rv(e) {
  return (e[W] & 4) === 4;
}
function Nc(e) {
  return (e[W] & 128) === 128;
}
function ov(e) {
  return _n(e[He]);
}
function sn(e, t) {
  return t == null ? null : e[t];
}
function Uf(e) {
  e[fo] = 0;
}
function Bf(e) {
  e[W] & 1024 || ((e[W] |= 1024), Nc(e) && Mr(e));
}
function iv(e, t) {
  for (; e > 0; ) (t = t[uo]), e--;
  return t;
}
function ps(e) {
  return !!(e[W] & 9216 || e[jt]?.dirty);
}
function Ac(e) {
  e[Nn].changeDetectionScheduler?.notify(8),
    e[W] & 64 && (e[W] |= 1024),
    ps(e) && Mr(e);
}
function Mr(e) {
  e[Nn].changeDetectionScheduler?.notify(0);
  let t = br(e);
  for (; t !== null && !(t[W] & 8192 || ((t[W] |= 8192), !Nc(t))); ) t = br(t);
}
function Hf(e, t) {
  if (mo(e)) throw new D(911, !1);
  e[er] === null && (e[er] = []), e[er].push(t);
}
function sv(e, t) {
  if (e[er] === null) return;
  let n = e[er].indexOf(t);
  n !== -1 && e[er].splice(n, 1);
}
function br(e) {
  let t = e[He];
  return _n(t) ? t[He] : t;
}
function $f(e) {
  return (e[ii] ??= []);
}
function zf(e) {
  return (e.cleanup ??= []);
}
function av(e, t, n, r) {
  let o = $f(t);
  o.push(n), e.firstCreatePass && zf(e).push(r, o.length - 1);
}
var X = { lFrame: bv(null), bindingsEnabled: !0, skipHydrationRootTNode: null },
  hs = (function (e) {
    return (
      (e[(e.Off = 0)] = "Off"),
      (e[(e.Exhaustive = 1)] = "Exhaustive"),
      (e[(e.OnlyDirtyViews = 2)] = "OnlyDirtyViews"),
      e
    );
  })(hs || {}),
  xE = 0,
  uf = !1;
function cv() {
  return X.lFrame.elementDepthCount;
}
function lv() {
  X.lFrame.elementDepthCount++;
}
function Gf() {
  X.lFrame.elementDepthCount--;
}
function Wf() {
  return X.bindingsEnabled;
}
function uv() {
  return X.skipHydrationRootTNode !== null;
}
function qf(e) {
  return X.skipHydrationRootTNode === e;
}
function Zf() {
  X.skipHydrationRootTNode = null;
}
function G() {
  return X.lFrame.lView;
}
function xe() {
  return X.lFrame.tView;
}
function I(e) {
  return (X.lFrame.contextLView = e), e[Re];
}
function S(e) {
  return (X.lFrame.contextLView = null), e;
}
function $e() {
  let e = Yf();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Yf() {
  return X.lFrame.currentTNode;
}
function dv() {
  let e = X.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function ci(e, t) {
  let n = X.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function Qf() {
  return X.lFrame.isParent;
}
function fv() {
  X.lFrame.isParent = !1;
}
function pv() {
  return X.lFrame.contextLView;
}
function Kf(e) {
  mf("Must never be called in production mode"), (xE = e);
}
function Jf() {
  return uf;
}
function li(e) {
  let t = uf;
  return (uf = e), t;
}
function Rc() {
  let e = X.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function Xf() {
  return X.lFrame.bindingIndex;
}
function hv(e) {
  return (X.lFrame.bindingIndex = e);
}
function ir() {
  return X.lFrame.bindingIndex++;
}
function kc(e) {
  let t = X.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function mv() {
  return X.lFrame.inI18n;
}
function gv(e, t) {
  let n = X.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), Oc(t);
}
function vv() {
  return X.lFrame.currentDirectiveIndex;
}
function Oc(e) {
  X.lFrame.currentDirectiveIndex = e;
}
function yv(e) {
  let t = X.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function ep() {
  return X.lFrame.currentQueryIndex;
}
function Pc(e) {
  X.lFrame.currentQueryIndex = e;
}
function NE(e) {
  let t = e[$];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[nn] : null;
}
function tp(e, t, n) {
  if (n & 4) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & 1); )
      if (((o = NE(i)), o === null || ((i = i[uo]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (X.lFrame = _v());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Fc(e) {
  let t = _v(),
    n = e[$];
  (X.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function _v() {
  let e = X.lFrame,
    t = e === null ? null : e.child;
  return t === null ? bv(e) : t;
}
function bv(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Cv() {
  let e = X.lFrame;
  return (X.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var np = Cv;
function Lc() {
  let e = Cv();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Ev(e) {
  return (X.lFrame.contextLView = iv(e, X.lFrame.contextLView))[Re];
}
function On() {
  return X.lFrame.selectedIndex;
}
function Tr(e) {
  X.lFrame.selectedIndex = e;
}
function ms() {
  let e = X.lFrame;
  return fs(e.tView, e.selectedIndex);
}
function ke() {
  X.lFrame.currentNamespace = Lf;
}
function vt() {
  AE();
}
function AE() {
  X.lFrame.currentNamespace = null;
}
function Dv() {
  return X.lFrame.currentNamespace;
}
var wv = !0;
function Vc() {
  return wv;
}
function jc(e) {
  wv = e;
}
var RE = { elements: void 0 };
function Uc() {
  return RE;
}
function df(e, t = null, n = null, r) {
  let o = rp(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function rp(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Ft, Qg(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : tr(e))),
    new ao(i, t || cs(), r || null, o)
  );
}
var gt = class e {
    static THROW_IF_NOT_FOUND = oo;
    static NULL = new rs();
    static create(t, n) {
      if (Array.isArray(t)) return df({ name: "" }, n, t, "");
      {
        let r = t.name ?? "";
        return df({ name: r }, t.parent, t.providers, r);
      }
    }
    static ɵprov = w({ token: e, providedIn: "any", factory: () => H(Sf) });
    static __NG_ELEMENT_ID__ = -1;
  },
  Oe = new M(""),
  Tt = (() => {
    class e {
      static __NG_ELEMENT_ID__ = kE;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  os = class extends Tt {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    get destroyed() {
      return mo(this._lView);
    }
    onDestroy(t) {
      let n = this._lView;
      return Hf(n, t), () => sv(n, t);
    }
  };
function kE() {
  return new os(G());
}
var Lt = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  yt = new M("", {
    providedIn: "root",
    factory: () => {
      let e = f(je),
        t;
      return (n) => {
        e.destroyed && !t
          ? setTimeout(() => {
              throw n;
            })
          : ((t ??= e.get(Lt)), t.handleError(n));
      };
    },
  }),
  Iv = { provide: rr, useValue: () => void f(Lt), multi: !0 },
  OE = new M("", {
    providedIn: "root",
    factory: () => {
      let e = f(Oe).defaultView;
      if (!e) return;
      let t = f(yt),
        n = (i) => {
          t(i.reason), i.preventDefault();
        },
        r = (i) => {
          i.error ? t(i.error) : t(new Error(i.message, { cause: i })),
            i.preventDefault();
        },
        o = () => {
          e.addEventListener("unhandledrejection", n),
            e.addEventListener("error", r);
        };
      typeof Zone < "u" ? Zone.root.run(o) : o(),
        f(Tt).onDestroy(() => {
          e.removeEventListener("error", r),
            e.removeEventListener("unhandledrejection", n);
        });
    },
  });
function op() {
  return xn([Yg(() => void f(OE))]);
}
function ip(e) {
  return typeof e == "function" && e[Xe] !== void 0;
}
function j(e, t) {
  let [n, r, o] = Pd(e, t?.equal),
    i = n,
    s = i[Xe];
  return (i.set = r), (i.update = o), (i.asReadonly = Bc.bind(i)), i;
}
function Bc() {
  let e = this[Xe];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[Xe] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function sp(e) {
  return ip(e) && typeof e.set == "function";
}
var en = class {},
  gs = new M("", { providedIn: "root", factory: () => !1 });
var ap = new M(""),
  Hc = new M("");
var ui = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      (this.view = n), (this.node = r);
    }
    static __NG_ELEMENT_ID__ = PE;
  }
  return e;
})();
function PE() {
  return new ui(G(), $e());
}
var Pn = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = !1;
      pendingTask = new et(!1);
      get hasPendingTasks() {
        return this.destroyed ? !1 : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new te((n) => {
              n.next(!1), n.complete();
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
        let n = this.taskId++;
        return this.pendingTasks.add(n), n;
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        this.pendingTasks.delete(n),
          this.pendingTasks.size === 0 &&
            this.hasPendingTasks &&
            this.pendingTask.next(!1);
      }
      ngOnDestroy() {
        this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(!1),
          (this.destroyed = !0),
          this.pendingTask.unsubscribe();
      }
      static ɵprov = w({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  vs = (() => {
    class e {
      internalPendingTasks = f(Pn);
      scheduler = f(en);
      errorHandler = f(yt);
      add() {
        let n = this.internalPendingTasks.add();
        return () => {
          this.internalPendingTasks.has(n) &&
            (this.scheduler.notify(11), this.internalPendingTasks.remove(n));
        };
      }
      run(n) {
        let r = this.add();
        n().catch(this.errorHandler).finally(r);
      }
      static ɵprov = w({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })();
function go(...e) {}
var ys = (() => {
    class e {
      static ɵprov = w({
        token: e,
        providedIn: "root",
        factory: () => new ff(),
      });
    }
    return e;
  })(),
  ff = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      this.enqueue(t), this.schedule(t);
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || r.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = !1;
        for (let [n, r] of this.queues)
          n === null
            ? (t ||= this.flushQueue(r))
            : (t ||= n.run(() => this.flushQueue(r)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let n = !1;
      for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = !0), r.run());
      return n;
    }
  };
function Ts(e) {
  return { toString: e }.toString();
}
function BE(e) {
  return typeof e == "function";
}
var Qc = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ny(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var Bt = (() => {
  let e = () => ry;
  return (e.ngInherit = !0), e;
})();
function ry(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = $E), HE;
}
function HE() {
  let e = iy(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Er) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function $E(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = iy(e) || zE(e, { previous: Er, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  (a[i] = new Qc(l && l.currentValue, n, c === Er)), ny(e, t, o, n);
}
var oy = "__ngSimpleChanges__";
function iy(e) {
  return e[oy] || null;
}
function zE(e, t) {
  return (e[oy] = t);
}
var Sv = [];
var ue = function (e, t = null, n) {
  for (let r = 0; r < Sv.length; r++) {
    let o = Sv[r];
    o(e, t, n);
  }
};
function GE(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = ry(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function sy(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      l &&
        ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u);
  }
}
function Gc(e, t, n) {
  ay(e, t, 3, n);
}
function Wc(e, t, n, r) {
  (e[W] & 3) === n && ay(e, t, n, r);
}
function cp(e, t) {
  let n = e[W];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[W] = n));
}
function ay(e, t, n, r) {
  let o = r !== void 0 ? e[fo] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[fo] += 65536),
        (a < i || i == -1) &&
          (WE(e, n, t, c), (e[fo] = (e[fo] & 4294901760) + c + 2)),
        c++;
}
function Mv(e, t) {
  ue(4, e, t);
  let n = z(null);
  try {
    t.call(e);
  } finally {
    z(n), ue(5, e, t);
  }
}
function WE(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[W] >> 14 < e[fo] >> 16 &&
      (e[W] & 3) === t &&
      ((e[W] += 16384), Mv(a, i))
    : Mv(a, i);
}
var fi = -1,
  _o = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, o) {
      (this.factory = t),
        (this.name = o),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function qE(e) {
  return (e.flags & 8) !== 0;
}
function ZE(e) {
  return (e.flags & 16) !== 0;
}
function YE(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      QE(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function cy(e) {
  return e === 3 || e === 4 || e === 6;
}
function QE(e) {
  return e.charCodeAt(0) === 64;
}
function pi(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Tv(e, n, o, null, t[++r])
              : Tv(e, n, o, null, null));
      }
    }
  return e;
}
function Tv(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o);
}
function ly(e) {
  return e !== fi;
}
function Kc(e) {
  return e & 32767;
}
function KE(e) {
  return e >> 16;
}
function Jc(e, t) {
  let n = KE(e),
    r = t;
  for (; n > 0; ) (r = r[uo]), n--;
  return r;
}
var _p = !0;
function Xc(e) {
  let t = _p;
  return (_p = e), t;
}
var JE = 256,
  uy = JE - 1,
  dy = 5,
  XE = 0,
  Fn = {};
function eD(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(co) && (r = n[co]),
    r == null && (r = n[co] = XE++);
  let o = r & uy,
    i = 1 << o;
  t.data[e + (o >> dy)] |= i;
}
function el(e, t) {
  let n = fy(e, t);
  if (n !== -1) return n;
  let r = t[$];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    lp(r.data, e),
    lp(t, null),
    lp(r.blueprint, null));
  let o = Yp(e, t),
    i = e.injectorIndex;
  if (ly(o)) {
    let s = Kc(o),
      a = Jc(o, t),
      c = a[$].data;
    for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l];
  }
  return (t[i + 8] = o), i;
}
function lp(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function fy(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Yp(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = vy(o)), r === null)) return fi;
    if ((n++, (o = o[uo]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return fi;
}
function bp(e, t, n) {
  eD(e, t, n);
}
function tD(e, t) {
  if (t === "class") return e.classes;
  if (t === "style") return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r; ) {
      let i = n[o];
      if (cy(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == "number")
        for (o++; o < r && typeof n[o] == "string"; ) o++;
      else {
        if (i === t) return n[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function py(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  Ic(t, "NodeInjector");
}
function hy(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let o = e[lo],
      i = mt(void 0);
    try {
      return o ? o.get(t, r, n & 8) : wf(t, r, n & 8);
    } finally {
      mt(i);
    }
  }
  return py(r, t, n);
}
function my(e, t, n, r = 0, o) {
  if (e !== null) {
    if (t[W] & 2048 && !(r & 2)) {
      let s = iD(e, t, n, r, Fn);
      if (s !== Fn) return s;
    }
    let i = gy(e, t, n, r, Fn);
    if (i !== Fn) return i;
  }
  return hy(t, n, r, o);
}
function gy(e, t, n, r, o) {
  let i = rD(n);
  if (typeof i == "function") {
    if (!tp(t, e, r)) return r & 1 ? py(o, n, r) : hy(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) Ic(n);
      else return s;
    } finally {
      np();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = fy(e, t),
      c = fi,
      l = r & 1 ? t[Vt][nn] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? Yp(e, t) : t[a + 8]),
      c === fi || !Nv(r, !1)
        ? (a = -1)
        : ((s = t[$]), (a = Kc(c)), (t = Jc(c, t))));
      a !== -1;

    ) {
      let u = t[$];
      if (xv(i, a, u.data)) {
        let d = nD(a, t, n, s, r, l);
        if (d !== Fn) return d;
      }
      (c = t[a + 8]),
        c !== fi && Nv(r, t[$].data[a + 8] === l) && xv(i, a, t)
          ? ((s = u), (a = Kc(c)), (t = Jc(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function nD(e, t, n, r, o, i) {
  let s = t[$],
    a = s.data[e + 8],
    c = r == null ? Sr(a) && _p : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = qc(a, s, n, c, l);
  return u !== null ? Cs(t, s, u, a, o) : Fn;
}
function qc(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    g = o ? a + u : l;
  for (let p = d; p < g; p++) {
    let C = s[p];
    if ((p < c && n === C) || (p >= c && C.type === n)) return p;
  }
  if (o) {
    let p = s[c];
    if (p && kn(p) && p.type === n) return c;
  }
  return null;
}
function Cs(e, t, n, r, o) {
  let i = e[n],
    s = t.data;
  if (i instanceof _o) {
    let a = i;
    if (a.resolving) {
      let p = Cc(s[n]);
      throw Df(p);
    }
    let c = Xc(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[n].type || s[n],
      u,
      d = a.injectImpl ? mt(a.injectImpl) : null,
      g = tp(e, r, 0);
    try {
      (i = e[n] = a.factory(void 0, o, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && GE(n, s[n], t);
    } finally {
      d !== null && mt(d), Xc(c), (a.resolving = !1), np();
    }
  }
  return i;
}
function rD(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(co) ? e[co] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & uy : oD) : t;
}
function xv(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> dy)] & r);
}
function Nv(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var yo = class {
  _tNode;
  _lView;
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return my(this._tNode, this._lView, t, io(r), n);
  }
};
function oD() {
  return new yo($e(), G());
}
function Vn(e) {
  return Ts(() => {
    let t = e.prototype.constructor,
      n = t[ns] || Cp(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[ns] || Cp(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Cp(e) {
  return hf(e)
    ? () => {
        let t = Cp(tt(e));
        return t && t();
      }
    : _r(e);
}
function iD(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[W] & 2048 && !ai(s); ) {
    let a = gy(i, s, n, r | 2, Fn);
    if (a !== Fn) return a;
    let c = i.parent;
    if (!c) {
      let l = s[Of];
      if (l) {
        let u = l.get(n, Fn, r);
        if (u !== Fn) return u;
      }
      (c = vy(s)), (s = s[uo]);
    }
    i = c;
  }
  return o;
}
function vy(e) {
  let t = e[$],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[nn] : null;
}
function xs(e) {
  return tD($e(), e);
}
function sD() {
  return vi($e(), G());
}
function vi(e, t) {
  return new _t(bn(e, t));
}
var _t = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = sD;
  }
  return e;
})();
function aD(e) {
  return e instanceof _t ? e.nativeElement : e;
}
function cD() {
  return this._results[Symbol.iterator]();
}
var tl = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new Ae());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = !1;
    let r = Gg(t);
    (this._changesDetected = !zg(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = cD;
};
function yy(e) {
  return (e.flags & 128) === 128;
}
var Qp = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Qp || {}),
  _y = new Map(),
  lD = 0;
function uD() {
  return lD++;
}
function dD(e) {
  _y.set(e[ls], e);
}
function Ep(e) {
  _y.delete(e[ls]);
}
var Av = "__ngContext__";
function hi(e, t) {
  Rn(t) ? ((e[Av] = t[ls]), dD(t)) : (e[Av] = t);
}
function by(e) {
  return Ey(e[si]);
}
function Cy(e) {
  return Ey(e[tn]);
}
function Ey(e) {
  for (; e !== null && !_n(e); ) e = e[tn];
  return e;
}
var Dp;
function Kp(e) {
  Dp = e;
}
function Dy() {
  if (Dp !== void 0) return Dp;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
var vl = new M("", { providedIn: "root", factory: () => fD }),
  fD = "ng",
  yl = new M(""),
  yi = new M("", { providedIn: "platform", factory: () => "unknown" });
var _l = new M("", {
  providedIn: "root",
  factory: () =>
    Dy().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var pD = "h",
  hD = "b";
var wy = "r";
var Iy = "di";
var Sy = !1,
  My = new M("", { providedIn: "root", factory: () => Sy });
var mD = (e, t, n, r) => {};
function gD(e, t, n, r) {
  mD(e, t, n, r);
}
function Jp(e) {
  return (e.flags & 32) === 32;
}
var vD = () => null;
function Ty(e, t, n = !1) {
  return vD(e, t, n);
}
function xy(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = z(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          Pc(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      z(r);
    }
  }
}
function wp(e, t, n) {
  Pc(0);
  let r = z(null);
  try {
    t(e, n);
  } finally {
    z(r);
  }
}
function Ny(e, t, n) {
  if (Ff(t)) {
    let r = z(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      z(r);
    }
  }
}
var sr = (function (e) {
  return (
    (e[(e.Emulated = 0)] = "Emulated"),
    (e[(e.None = 2)] = "None"),
    (e[(e.ShadowDom = 3)] = "ShadowDom"),
    e
  );
})(sr || {});
var $c;
function yD() {
  if ($c === void 0 && (($c = null), nr.trustedTypes))
    try {
      $c = nr.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return $c;
}
function Rv(e) {
  return yD()?.createScriptURL(e) || e;
}
var nl = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Dc})`;
  }
};
function bl(e) {
  return e instanceof nl ? e.changingThisBreaksApplicationSecurity : e;
}
function Xp(e, t) {
  let n = Ay(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Dc})`);
  }
  return n === t;
}
function Ay(e) {
  return (e instanceof nl && e.getTypeName()) || null;
}
var _D = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Ry(e) {
  return (e = String(e)), e.match(_D) ? e : "unsafe:" + e;
}
var Cl = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Cl || {});
function ft(e) {
  let t = Oy();
  return t ? t.sanitize(Cl.URL, e) || "" : Xp(e, "URL") ? bl(e) : Ry(vn(e));
}
function ky(e) {
  let t = Oy();
  if (t) return Rv(t.sanitize(Cl.RESOURCE_URL, e) || "");
  if (Xp(e, "ResourceURL")) return Rv(bl(e));
  throw new D(904, !1);
}
function bD(e, t) {
  return (t === "src" &&
    (e === "embed" ||
      e === "frame" ||
      e === "iframe" ||
      e === "media" ||
      e === "script")) ||
    (t === "href" && (e === "base" || e === "link"))
    ? ky
    : ft;
}
function eh(e, t, n) {
  return bD(t, n)(e);
}
function Oy() {
  let e = G();
  return e && e[Nn].sanitizer;
}
function th(e) {
  return e.ownerDocument.defaultView;
}
function Py(e) {
  return e instanceof Function ? e() : e;
}
function CD(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var Fy = "ng-template";
function ED(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && CD(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (nh(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function nh(e) {
  return e.type === 4 && e.value !== Fy;
}
function DD(e, t, n) {
  let r = e.type === 4 && !n ? Fy : e.value;
  return t === r;
}
function wD(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? MD(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !Cn(r) && !Cn(c)) return !1;
      if (s && Cn(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !DD(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (Cn(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !ED(e, o, c, n)) {
          if (Cn(r)) return !1;
          s = !0;
        }
      } else {
        let l = t[++a],
          u = ID(c, o, nh(e), n);
        if (u === -1) {
          if (Cn(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (Cn(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return Cn(r) || s;
}
function Cn(e) {
  return (e & 1) === 0;
}
function ID(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return TD(t, e);
}
function SD(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (wD(e, t[r], n)) return !0;
  return !1;
}
function MD(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (cy(n)) return t;
  }
  return e.length;
}
function TD(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function kv(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function xD(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !Cn(s) && ((t += kv(i, o)), (o = "")),
        (r = s),
        (i = i || !Cn(r));
    n++;
  }
  return o !== "" && (t += kv(i, o)), t;
}
function ND(e) {
  return e.map(xD).join(",");
}
function AD(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!Cn(o)) break;
      o = i;
    }
    r++;
  }
  return n.length && t.push(1, ...n), t;
}
var pt = {};
function RD(e, t) {
  return e.createText(t);
}
function kD(e, t, n) {
  e.setValue(t, n);
}
function Ly(e, t, n) {
  return e.createElement(t, n);
}
function rl(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Vy(e, t, n) {
  e.appendChild(t, n);
}
function Ov(e, t, n, r, o) {
  r !== null ? rl(e, t, n, r, o) : Vy(e, t, n);
}
function jy(e, t, n) {
  e.removeChild(null, t, n);
}
function OD(e, t, n) {
  e.setAttribute(t, "style", n);
}
function PD(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Uy(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && YE(e, t, r),
    o !== null && PD(e, t, o),
    i !== null && OD(e, t, i);
}
function rh(e, t, n, r, o, i, s, a, c, l, u) {
  let d = Te + r,
    g = d + o,
    p = FD(d, g),
    C = typeof l == "function" ? l() : l;
  return (p[$] = {
    type: e,
    blueprint: p,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: p.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: g,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: C,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function FD(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : pt);
  return n;
}
function LD(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = rh(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function oh(e, t, n, r, o, i, s, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[yn] = o),
    (d[W] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[W] & 2048)) && (d[W] |= 2048),
    Uf(d),
    (d[He] = d[uo] = e),
    (d[Re] = n),
    (d[Nn] = s || (e && e[Nn])),
    (d[be] = a || (e && e[be])),
    (d[lo] = c || (e && e[lo]) || null),
    (d[nn] = i),
    (d[ls] = uD()),
    (d[oi] = u),
    (d[Of] = l),
    (d[Vt] = t.type == 2 ? e[Vt] : d),
    d
  );
}
function VD(e, t, n) {
  let r = bn(t, e),
    o = LD(n),
    i = e[Nn].rendererFactory,
    s = ih(
      e,
      oh(
        e,
        o,
        null,
        By(n),
        r,
        t,
        null,
        i.createRenderer(r, n),
        null,
        null,
        null
      )
    );
  return (e[t.index] = s);
}
function By(e) {
  let t = 16;
  return e.signals ? (t = 4096) : e.onPush && (t = 64), t;
}
function Hy(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function ih(e, t) {
  return e[si] ? (e[kf][tn] = t) : (e[si] = t), (e[kf] = t), t;
}
function v(e = 1) {
  $y(xe(), G(), On() + e, !1);
}
function $y(e, t, n, r) {
  if (!r)
    if ((t[W] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Gc(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Wc(t, i, 0, n);
    }
  Tr(n);
}
var El = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(El || {});
function Ip(e, t, n, r) {
  let o = z(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    (s & El.SignalBased) !== 0 && (c = t[i][Xe]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : ny(t, c, i, r);
  } finally {
    z(o);
  }
}
var Ln = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(Ln || {}),
  jD;
function sh(e, t) {
  return jD(e, t);
}
function di(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    _n(r) ? (i = r) : Rn(r) && ((s = !0), (r = r[yn]));
    let a = rn(r);
    e === 0 && n !== null
      ? o == null
        ? Vy(t, n, a)
        : rl(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? rl(t, n, a, o || null, !0)
      : e === 2
      ? jy(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && KD(t, e, i, n, o);
  }
}
function UD(e, t) {
  zy(e, t), (t[yn] = null), (t[nn] = null);
}
function BD(e, t, n, r, o, i) {
  (r[yn] = o), (r[nn] = t), wl(e, r, n, 1, o, i);
}
function zy(e, t) {
  t[Nn].changeDetectionScheduler?.notify(9), wl(e, t, t[be], 2, null, null);
}
function HD(e) {
  let t = e[si];
  if (!t) return up(e[$], e);
  for (; t; ) {
    let n = null;
    if (Rn(t)) n = t[si];
    else {
      let r = t[Ze];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[tn] && t !== e; ) Rn(t) && up(t[$], t), (t = t[He]);
      t === null && (t = e), Rn(t) && up(t[$], t), (n = t && t[tn]);
    }
    t = n;
  }
}
function ah(e, t) {
  let n = e[ho],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Dl(e, t) {
  if (mo(t)) return;
  let n = t[be];
  n.destroyNode && wl(e, t, n, 3, null, null), HD(t);
}
function up(e, t) {
  if (mo(t)) return;
  let n = z(null);
  try {
    (t[W] &= -129),
      (t[W] |= 256),
      t[jt] && Kr(t[jt]),
      zD(e, t),
      $D(e, t),
      t[$].type === 1 && t[be].destroy();
    let r = t[wr];
    if (r !== null && _n(t[He])) {
      r !== t[He] && ah(r, t);
      let o = t[An];
      o !== null && o.detachView(e);
    }
    Ep(t);
  } finally {
    z(n);
  }
}
function $D(e, t) {
  let n = e.cleanup,
    r = t[ii];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let a = n[s + 3];
        a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2);
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[ii] = null);
  let o = t[er];
  if (o !== null) {
    t[er] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[or];
  if (i !== null) {
    t[or] = null;
    for (let s of i) s.destroy();
  }
}
function zD(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof _o)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            ue(4, a, c);
            try {
              c.call(a);
            } finally {
              ue(5, a, c);
            }
          }
        else {
          ue(4, o, i);
          try {
            i.call(o);
          } finally {
            ue(5, o, i);
          }
        }
      }
    }
}
function GD(e, t, n) {
  return WD(e, t.parent, n);
}
function WD(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[yn];
  if (Sr(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === sr.None || o === sr.Emulated) return null;
  }
  return bn(r, n);
}
function qD(e, t, n) {
  return YD(e, t, n);
}
function ZD(e, t, n) {
  return e.type & 40 ? bn(e, n) : null;
}
var YD = ZD,
  Pv;
function ch(e, t, n, r) {
  let o = GD(e, r, t),
    i = t[be],
    s = r.parent || t[nn],
    a = qD(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Ov(i, o, n[c], a, !1);
    else Ov(i, o, n, a, !1);
  Pv !== void 0 && Pv(i, r, t, n, o);
}
function _s(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return bn(t, e);
    if (n & 4) return Sp(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return _s(e, r);
      {
        let o = e[t.index];
        return _n(o) ? Sp(-1, o) : rn(o);
      }
    } else {
      if (n & 128) return _s(e, t.next);
      if (n & 32) return sh(t, e)() || rn(e[t.index]);
      {
        let r = Gy(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = br(e[Vt]);
          return _s(o, r);
        } else return _s(e, t.next);
      }
    }
  }
  return null;
}
function Gy(e, t) {
  if (t !== null) {
    let r = e[Vt][nn],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Sp(e, t) {
  let n = Ze + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[$].firstChild;
    if (o !== null) return _s(r, o);
  }
  return t[Ir];
}
function lh(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if ((s && t === 0 && (a && hi(rn(a), r), (n.flags |= 2)), !Jp(n)))
      if (c & 8) lh(e, t, n.child, r, o, i, !1), di(t, e, o, a, i);
      else if (c & 32) {
        let l = sh(n, r),
          u;
        for (; (u = l()); ) di(t, e, o, u, i);
        di(t, e, o, a, i);
      } else c & 16 ? QD(e, t, r, n, o, i) : di(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function wl(e, t, n, r, o, i) {
  lh(n, r, e.firstChild, t, o, i, !1);
}
function QD(e, t, n, r, o, i) {
  let s = n[Vt],
    c = s[nn].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      di(t, e, o, u, i);
    }
  else {
    let l = c,
      u = s[He];
    yy(r) && (l.flags |= 128), lh(e, t, l, u, o, i, !0);
  }
}
function KD(e, t, n, r, o) {
  let i = n[Ir],
    s = rn(n);
  i !== s && di(t, e, r, i, o);
  for (let a = Ze; a < n.length; a++) {
    let c = n[a];
    wl(c[$], c, e, t, r, i);
  }
}
function JD(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : Ln.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= Ln.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Wy(e, t, n, r, o) {
  let i = On(),
    s = r & 2;
  try {
    Tr(-1),
      s && t.length > Te && $y(e, t, Te, !1),
      ue(s ? 2 : 0, o, n),
      n(r, o);
  } finally {
    Tr(i), ue(s ? 3 : 1, o, n);
  }
}
function uh(e, t, n) {
  ow(e, t, n), (n.flags & 64) === 64 && iw(e, t, n);
}
function Il(e, t, n = bn) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function XD(e, t, n, r) {
  let i = r.get(My, Sy) || n === sr.ShadowDom,
    s = e.selectRootElement(t, i);
  return ew(s), s;
}
function ew(e) {
  tw(e);
}
var tw = () => null;
function nw(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function qy(e, t, n, r, o, i) {
  let s = t[$];
  if (dh(e, s, t, n, r)) {
    Sr(e) && rw(t, e.index);
    return;
  }
  e.type & 3 && (n = nw(n)), Zy(e, t, n, r, o, i);
}
function Zy(e, t, n, r, o, i) {
  if (e.type & 3) {
    let s = bn(e, t);
    (r = i != null ? i(r, e.value || "", n) : r), o.setProperty(s, n, r);
  } else e.type & 12;
}
function rw(e, t) {
  let n = on(t, e);
  n[W] & 16 || (n[W] |= 64);
}
function ow(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  Sr(n) && VD(t, n, e.data[r + n.componentOffset]),
    e.firstCreatePass || el(n, t);
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = Cs(t, e, s, n);
    if ((hi(c, t), i !== null && lw(t, s - r, c, a, n, i), kn(a))) {
      let l = on(n.index, t);
      l[Re] = Cs(t, e, s, n);
    }
  }
}
function iw(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = vv();
  try {
    Tr(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = t[a];
      Oc(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          sw(c, l);
    }
  } finally {
    Tr(-1), Oc(s);
  }
}
function sw(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Yy(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      SD(t, i.selectors, !1) && ((r ??= []), kn(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function aw(e, t, n, r, o, i) {
  let s = bn(e, t);
  cw(t[be], s, i, e.value, n, r, o);
}
function cw(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? vn(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function lw(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Ip(r, n, c, l);
    }
}
function Qy(e, t, n, r, o) {
  let i = Te + n,
    s = t[$],
    a = o(s, t, e, r, n);
  (t[i] = a), ci(e, !0);
  let c = e.type === 2;
  return (
    c ? (Uy(t[be], a, e), (cv() === 0 || ds(e)) && hi(a, t), lv()) : hi(a, t),
    Vc() && (!c || !Jp(e)) && ch(s, t, a, e),
    e
  );
}
function Ky(e) {
  let t = e;
  return Qf() ? fv() : ((t = t.parent), ci(t, !1)), t;
}
function uw(e, t) {
  let n = e[lo];
  if (!n) return;
  let r;
  try {
    r = n.get(yt, null);
  } catch {
    r = null;
  }
  r?.(t);
}
function dh(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = t.data[l];
      Ip(d, n[l], u, o), (a = !0);
    }
  if (i)
    for (let c of i) {
      let l = n[c],
        u = t.data[c];
      Ip(u, l, r, o), (a = !0);
    }
  return a;
}
function dw(e, t) {
  let n = on(t, e),
    r = n[$];
  fw(r, n);
  let o = n[yn];
  o !== null && n[oi] === null && (n[oi] = Ty(o, n[lo])),
    ue(18),
    fh(r, n, n[Re]),
    ue(19, n[Re]);
}
function fw(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function fh(e, t, n) {
  Fc(t);
  try {
    let r = e.viewQuery;
    r !== null && wp(1, r, n);
    let o = e.template;
    o !== null && Wy(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[An]?.finishViewCreation(e),
      e.staticContentQueries && xy(e, t),
      e.staticViewQueries && wp(2, e.viewQuery, n);
    let i = e.components;
    i !== null && pw(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[W] &= -5), Lc();
  }
}
function pw(e, t) {
  for (let n = 0; n < t.length; n++) dw(e, t[n]);
}
function Sl(e, t, n, r) {
  let o = z(null);
  try {
    let i = t.tView,
      a = e[W] & 4096 ? 4096 : 16,
      c = oh(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      l = e[t.index];
    c[wr] = l;
    let u = e[An];
    return u !== null && (c[An] = u.createEmbeddedView(i)), fh(i, c, n), c;
  } finally {
    z(o);
  }
}
function Es(e, t) {
  return !t || t.firstChild === null || yy(e);
}
var Fv = !1,
  hw = new M("");
function Ds(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(rn(i)), _n(i) && Jy(i, r);
    let s = n.type;
    if (s & 8) Ds(e, t, n.child, r);
    else if (s & 32) {
      let a = sh(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Gy(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = br(t[Vt]);
        Ds(c[$], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Jy(e, t) {
  for (let n = Ze; n < e.length; n++) {
    let r = e[n],
      o = r[$].firstChild;
    o !== null && Ds(r[$], r, o, t);
  }
  e[Ir] !== e[yn] && t.push(e[Ir]);
}
function Xy(e) {
  if (e[po] !== null) {
    for (let t of e[po]) t.impl.addSequence(t);
    e[po].length = 0;
  }
}
var e_ = [];
function mw(e) {
  return e[jt] ?? gw(e);
}
function gw(e) {
  let t = e_.pop() ?? Object.create(yw);
  return (t.lView = e), t;
}
function vw(e) {
  e.lView[jt] !== e && ((e.lView = null), e_.push(e));
}
var yw = B(b({}, Zr), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    Mr(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[jt] = this;
  },
});
function _w(e) {
  let t = e[jt] ?? Object.create(bw);
  return (t.lView = e), t;
}
var bw = B(b({}, Zr), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let t = br(e.lView);
    for (; t && !t_(t[$]); ) t = br(t);
    t && Bf(t);
  },
  consumerOnSignalRead() {
    this.lView[jt] = this;
  },
});
function t_(e) {
  return e.type !== 2;
}
function n_(e) {
  if (e[or] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[or])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    t = n && !!(e[W] & 8192);
  }
}
var Cw = 100;
function ph(e, t = 0) {
  let r = e[Nn].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    Ew(e, t);
  } finally {
    o || r.end?.();
  }
}
function Ew(e, t) {
  let n = Jf();
  try {
    li(!0), Mp(e, t);
    let r = 0;
    for (; ps(e); ) {
      if (r === Cw) throw new D(103, !1);
      r++, Mp(e, 1);
    }
  } finally {
    li(n);
  }
}
function r_(e, t) {
  Kf(t ? hs.Exhaustive : hs.OnlyDirtyViews);
  try {
    ph(e);
  } finally {
    Kf(hs.Off);
  }
}
function Dw(e, t, n, r) {
  if (mo(t)) return;
  let o = t[W],
    i = !1,
    s = !1;
  Fc(t);
  let a = !0,
    c = null,
    l = null;
  i ||
    (t_(e)
      ? ((l = mw(t)), (c = Qr(l)))
      : Ua() === null
      ? ((a = !1), (l = _w(t)), (c = Qr(l)))
      : t[jt] && (Kr(t[jt]), (t[jt] = null)));
  try {
    Uf(t), hv(e.bindingStartIndex), n !== null && Wy(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let p = e.preOrderCheckHooks;
        p !== null && Gc(t, p, null);
      } else {
        let p = e.preOrderHooks;
        p !== null && Wc(t, p, 0, null), cp(t, 0);
      }
    if (
      (s || ww(t), n_(t), o_(t, 0), e.contentQueries !== null && xy(e, t), !i)
    )
      if (u) {
        let p = e.contentCheckHooks;
        p !== null && Gc(t, p);
      } else {
        let p = e.contentHooks;
        p !== null && Wc(t, p, 1), cp(t, 1);
      }
    Sw(e, t);
    let d = e.components;
    d !== null && s_(t, d, 0);
    let g = e.viewQuery;
    if ((g !== null && wp(2, g, r), !i))
      if (u) {
        let p = e.viewCheckHooks;
        p !== null && Gc(t, p);
      } else {
        let p = e.viewHooks;
        p !== null && Wc(t, p, 2), cp(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Tc])) {
      for (let p of t[Tc]) p();
      t[Tc] = null;
    }
    i || (Xy(t), (t[W] &= -73));
  } catch (u) {
    throw (i || Mr(t), u);
  } finally {
    l !== null && (Ho(l, c), a && vw(l)), Lc();
  }
}
function o_(e, t) {
  for (let n = by(e); n !== null; n = Cy(n))
    for (let r = Ze; r < n.length; r++) {
      let o = n[r];
      i_(o, t);
    }
}
function ww(e) {
  for (let t = by(e); t !== null; t = Cy(t)) {
    if (!(t[W] & 2)) continue;
    let n = t[ho];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Bf(o);
    }
  }
}
function Iw(e, t, n) {
  ue(18);
  let r = on(t, e);
  i_(r, n), ue(19, r[Re]);
}
function i_(e, t) {
  Nc(e) && Mp(e, t);
}
function Mp(e, t) {
  let r = e[$],
    o = e[W],
    i = e[jt],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && $o(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[W] &= -9217),
    s)
  )
    Dw(r, e, r.template, e[Re]);
  else if (o & 8192) {
    let a = z(null);
    try {
      n_(e), o_(e, 1);
      let c = r.components;
      c !== null && s_(e, c, 1), Xy(e);
    } finally {
      z(a);
    }
  }
}
function s_(e, t, n) {
  for (let r = 0; r < t.length; r++) Iw(e, t[r], n);
}
function Sw(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Tr(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          gv(s, i);
          let c = t[i];
          ue(24, c), a(2, c), ue(25, c);
        }
      }
    } finally {
      Tr(-1);
    }
}
function hh(e, t) {
  let n = Jf() ? 64 : 1088;
  for (e[Nn].changeDetectionScheduler?.notify(t); e; ) {
    e[W] |= n;
    let r = br(e);
    if (ai(e) && !r) return e;
    e = r;
  }
  return null;
}
function a_(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function c_(e, t) {
  let n = Ze + t;
  if (n < e.length) return e[n];
}
function Ml(e, t, n, r = !0) {
  let o = t[$];
  if ((Mw(o, t, e, n), r)) {
    let s = Sp(n, e),
      a = t[be],
      c = a.parentNode(e[Ir]);
    c !== null && BD(o, e[nn], a, t, c, s);
  }
  let i = t[oi];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function l_(e, t) {
  let n = ws(e, t);
  return n !== void 0 && Dl(n[$], n), n;
}
function ws(e, t) {
  if (e.length <= Ze) return;
  let n = Ze + t,
    r = e[n];
  if (r) {
    let o = r[wr];
    o !== null && o !== e && ah(o, r), t > 0 && (e[n - 1][tn] = r[tn]);
    let i = ss(e, Ze + t);
    UD(r[$], r);
    let s = i[An];
    s !== null && s.detachView(i[$]),
      (r[He] = null),
      (r[tn] = null),
      (r[W] &= -129);
  }
  return r;
}
function Mw(e, t, n, r) {
  let o = Ze + r,
    i = n.length;
  r > 0 && (n[o - 1][tn] = t),
    r < i - Ze
      ? ((t[tn] = n[o]), If(n, Ze + r, t))
      : (n.push(t), (t[tn] = null)),
    (t[He] = n);
  let s = t[wr];
  s !== null && n !== s && u_(s, t);
  let a = t[An];
  a !== null && a.insertView(e), Ac(t), (t[W] |= 128);
}
function u_(e, t) {
  let n = e[ho],
    r = t[He];
  if (Rn(r)) e[W] |= 2;
  else {
    let o = r[He][Vt];
    t[Vt] !== o && (e[W] |= 2);
  }
  n === null ? (e[ho] = [t]) : n.push(t);
}
var xr = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[$];
    return Ds(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    (this._lView = t), (this._cdRefInjectingView = n);
  }
  get context() {
    return this._lView[Re];
  }
  set context(t) {
    this._lView[Re] = t;
  }
  get destroyed() {
    return mo(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[He];
      if (_n(t)) {
        let n = t[us],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (ws(t, r), ss(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Dl(this._lView[$], this._lView);
  }
  onDestroy(t) {
    Hf(this._lView, t);
  }
  markForCheck() {
    hh(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[W] &= -129;
  }
  reattach() {
    Ac(this._lView), (this._lView[W] |= 128);
  }
  detectChanges() {
    (this._lView[W] |= 1024), ph(this._lView);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new D(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = ai(this._lView),
      n = this._lView[wr];
    n !== null && !t && ah(n, this._lView), zy(this._lView[$], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new D(902, !1);
    this._appRef = t;
    let n = ai(this._lView),
      r = this._lView[wr];
    r !== null && !n && u_(r, this._lView), Ac(this._lView);
  }
};
var Nr = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = Tw;
    constructor(n, r, o) {
      (this._declarationLView = n),
        (this._declarationTContainer = r),
        (this.elementRef = o);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, o) {
      let i = Sl(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: r,
        dehydratedView: o,
      });
      return new xr(i);
    }
  }
  return e;
})();
function Tw() {
  return mh($e(), G());
}
function mh(e, t) {
  return e.type & 4 ? new Nr(t, e, vi(e, t)) : null;
}
function Ns(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = xw(e, t, n, r, o)), mv() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = dv();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return ci(i, !0), i;
}
function xw(e, t, n, r, o) {
  let i = Yf(),
    s = Qf(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = Aw(e, a, n, t, r, o));
  return Nw(e, c, i, s), c;
}
function Nw(e, t, n, r) {
  e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n)));
}
function Aw(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    uv() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var gV = new RegExp(`^(\\d+)*(${hD}|${pD})*(.*)`);
function Rw(e) {
  let t = e[Pf] ?? [],
    r = e[He][be],
    o = [];
  for (let i of t) i.data[Iy] !== void 0 ? o.push(i) : kw(i, r);
  e[Pf] = o;
}
function kw(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[wy];
    for (; n < o; ) {
      let i = r.nextSibling;
      jy(t, r, !1), (r = i), n++;
    }
  }
}
var Ow = () => null,
  Pw = () => null;
function Tp(e, t) {
  return Ow(e, t);
}
function d_(e, t, n) {
  return Pw(e, t, n);
}
var f_ = class {},
  Tl = class {},
  xp = class {
    resolveComponentFactory(t) {
      throw new D(917, !1);
    }
  },
  As = class {
    static NULL = new xp();
  },
  bo = class {},
  En = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => Fw();
    }
    return e;
  })();
function Fw() {
  let e = G(),
    t = $e(),
    n = on(t.index, e);
  return (Rn(n) ? n : e)[be];
}
var p_ = (() => {
  class e {
    static ɵprov = w({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var Zc = {},
  Np = class {
    injector;
    parentInjector;
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      let o = this.injector.get(t, Zc, r);
      return o !== Zc || n === Zc ? o : this.parentInjector.get(t, n, r);
    }
  };
function ol(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = pf(o, a);
      else if (i == 2) {
        let c = a,
          l = t[++s];
        r = pf(r, c + ": " + l + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
function k(e, t = 0) {
  let n = G();
  if (n === null) return H(e, t);
  let r = $e();
  return my(r, n, tt(e), t);
}
function h_(e, t, n, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, n);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    jw(e, t, n, a, i, c, l);
  }
  i !== null && r !== null && Lw(n, r, i);
}
function Lw(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new D(-301, !1);
    r.push(t[o], i);
  }
}
function Vw(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function jw(e, t, n, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let g = 0; g < a; g++) {
    let p = r[g];
    !c && kn(p) && ((c = !0), Vw(e, n, g)), bp(el(n, t), e, p.type);
  }
  Gw(n, e.data.length, a);
  for (let g = 0; g < a; g++) {
    let p = r[g];
    p.providersResolver && p.providersResolver(p);
  }
  let l = !1,
    u = !1,
    d = Hy(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let g = 0; g < a; g++) {
    let p = r[g];
    if (
      ((n.mergedAttrs = pi(n.mergedAttrs, p.hostAttrs)),
      Bw(e, n, t, d, p),
      zw(d, p, o),
      s !== null && s.has(p))
    ) {
      let [N, T] = s.get(p);
      n.directiveToIndex.set(p.type, [
        d,
        N + n.directiveStart,
        T + n.directiveStart,
      ]);
    } else (i === null || !i.has(p)) && n.directiveToIndex.set(p.type, d);
    p.contentQueries !== null && (n.flags |= 4),
      (p.hostBindings !== null || p.hostAttrs !== null || p.hostVars !== 0) &&
        (n.flags |= 64);
    let C = p.type.prototype;
    !l &&
      (C.ngOnChanges || C.ngOnInit || C.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (l = !0)),
      !u &&
        (C.ngOnChanges || C.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (u = !0)),
      d++;
  }
  Uw(e, n, i);
}
function Uw(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) Lv(0, t, o, r), Lv(1, t, o, r), jv(t, r, !1);
    else {
      let i = n.get(o);
      Vv(0, t, i, r), Vv(1, t, i, r), jv(t, r, !0);
    }
  }
}
function Lv(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        m_(t, i);
    }
}
function Vv(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      e === 0
        ? (a = t.hostDirectiveInputs ??= {})
        : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        m_(t, s);
    }
}
function m_(e, t) {
  t === "class" ? (e.flags |= 8) : t === "style" && (e.flags |= 16);
}
function jv(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || nh(e)) {
    (e.initialInputs ??= []), e.initialInputs.push(null);
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == "number") break;
    if (!n && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === t) {
          (s ??= []), s.push(c, r[a + 1]);
          break;
        }
    } else if (n && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === t) {
          (s ??= []), s.push(l[u + 1], r[a + 1]);
          break;
        }
    }
    a += 2;
  }
  (e.initialInputs ??= []), e.initialInputs.push(s);
}
function Bw(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = _r(o.type, !0)),
    s = new _o(i, kn(o), k, null);
  (e.blueprint[r] = s), (n[r] = s), Hw(e, t, r, Hy(e, n, o.hostVars, pt), o);
}
function Hw(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    $w(s) != a && s.push(a), s.push(n, r, i);
  }
}
function $w(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function zw(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    kn(t) && (n[""] = e);
  }
}
function Gw(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function g_(e, t, n, r, o, i, s, a) {
  let c = t[$],
    l = c.consts,
    u = sn(l, s),
    d = Ns(c, e, n, r, u);
  return (
    i && h_(c, t, d, sn(l, a), o),
    (d.mergedAttrs = pi(d.mergedAttrs, d.attrs)),
    d.attrs !== null && ol(d, d.attrs, !1),
    d.mergedAttrs !== null && ol(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function v_(e, t) {
  sy(e, t), Ff(t) && e.queries.elementEnd(t);
}
function Ww(e, t, n, r, o, i) {
  let s = t.consts,
    a = sn(s, o),
    c = Ns(t, e, n, r, a);
  if (((c.mergedAttrs = pi(c.mergedAttrs, c.attrs)), i != null)) {
    let l = sn(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && ol(c, c.attrs, !1),
    c.mergedAttrs !== null && ol(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function gh(e, t, n) {
  return (e[t] = n);
}
function qw(e, t) {
  return e[t];
}
function Ut(e, t, n) {
  if (n === pt) return !1;
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function vh(e, t, n, r) {
  let o = Ut(e, t, n);
  return Ut(e, t + 1, r) || o;
}
function Zw(e, t, n, r, o) {
  let i = vh(e, t, n, r);
  return Ut(e, t + 2, o) || i;
}
function Yc(e, t, n) {
  return function r(o) {
    let i = Sr(e) ? on(e.index, t) : t;
    hh(i, 5);
    let s = t[Re],
      a = Uv(t, s, n, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) (a = Uv(t, s, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function Uv(e, t, n, r) {
  let o = z(null);
  try {
    return ue(6, t, n), n(r) !== !1;
  } catch (i) {
    return uw(e, i), !1;
  } finally {
    ue(7, t, n), z(o);
  }
}
function y_(e, t, n, r, o, i, s, a) {
  let c = ds(e),
    l = !1,
    u = null;
  if ((!r && c && (u = Yw(t, n, i, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    (d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (l = !0);
  } else {
    let d = bn(e, n),
      g = r ? r(d) : d;
    gD(n, g, i, a);
    let p = o.listen(g, i, a),
      C = r ? (N) => r(rn(N[e.index])) : e.index;
    __(C, t, n, i, a, p, !1);
  }
  return l;
}
function Yw(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[ii],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function __(e, t, n, r, o, i, s) {
  let a = t.firstCreatePass ? zf(t) : null,
    c = $f(n),
    l = c.length;
  c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1));
}
function Bv(e, t, n, r, o, i) {
  let s = t[n],
    a = t[$],
    l = a.data[n].outputs[r],
    d = s[l].subscribe(i);
  __(e.index, a, t, o, i, d, !0);
}
var Ap = Symbol("BINDING");
var il = class extends As {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = Dr(t);
    return new mi(n, this.ngModule);
  }
};
function Qw(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = {
        propName: n,
        templateName: t,
        isSignal: (r & El.SignalBased) !== 0,
      };
    return o && (i.transform = o), i;
  });
}
function Kw(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function Jw(e, t, n) {
  let r = t instanceof je ? t : t?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new Np(n, r) : n
  );
}
function Xw(e) {
  let t = e.get(bo, null);
  if (t === null) throw new D(407, !1);
  let n = e.get(p_, null),
    r = e.get(en, null);
  return {
    rendererFactory: t,
    sanitizer: n,
    changeDetectionScheduler: r,
    ngReflect: !1,
  };
}
function eI(e, t) {
  let n = b_(e);
  return Ly(t, n, n === "svg" ? Lf : n === "math" ? nv : null);
}
function b_(e) {
  return (e.selectors[0][0] || "div").toLowerCase();
}
var mi = class extends Tl {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return (
      (this.cachedInputs ??= Qw(this.componentDef.inputs)), this.cachedInputs
    );
  }
  get outputs() {
    return (
      (this.cachedOutputs ??= Kw(this.componentDef.outputs)), this.cachedOutputs
    );
  }
  constructor(t, n) {
    super(),
      (this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = ND(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n);
  }
  create(t, n, r, o, i, s) {
    ue(22);
    let a = z(null);
    try {
      let c = this.componentDef,
        l = tI(r, c, s, i),
        u = Jw(c, o || this.ngModule, t),
        d = Xw(u),
        g = d.rendererFactory.createRenderer(null, c),
        p = r ? XD(g, r, c.encapsulation, u) : eI(c, g),
        C =
          s?.some(Hv) ||
          i?.some((x) => typeof x != "function" && x.bindings.some(Hv)),
        N = oh(
          null,
          l,
          null,
          512 | By(c),
          null,
          null,
          d,
          g,
          u,
          null,
          Ty(p, u, !0)
        );
      (N[Te] = p), Fc(N);
      let T = null;
      try {
        let x = g_(Te, N, 2, "#host", () => l.directiveRegistry, !0, 0);
        p && (Uy(g, p, x), hi(p, N)),
          uh(l, N, x),
          Ny(l, x, N),
          v_(l, x),
          n !== void 0 && rI(x, this.ngContentSelectors, n),
          (T = on(x.index, N)),
          (N[Re] = T[Re]),
          fh(l, N, null);
      } catch (x) {
        throw (T !== null && Ep(T), Ep(N), x);
      } finally {
        ue(23), Lc();
      }
      return new sl(this.componentType, N, !!C);
    } finally {
      z(a);
    }
  }
};
function tI(e, t, n, r) {
  let o = e ? ["ng-version", "20.3.0"] : AD(t.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (n)
    for (let u of n)
      (a += u[Ap].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != "function")
        for (let g of d.bindings) {
          a += g[Ap].requiredVars;
          let p = u + 1;
          g.create && ((g.targetIdx = p), (i ??= []).push(g)),
            g.update && ((g.targetIdx = p), (s ??= []).push(g));
        }
    }
  let c = [t];
  if (r)
    for (let u of r) {
      let d = typeof u == "function" ? u : u.type,
        g = xf(d);
      c.push(g);
    }
  return rh(0, null, nI(i, s), 1, a, c, null, null, null, [o], null);
}
function nI(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function Hv(e) {
  let t = e[Ap].kind;
  return t === "input" || t === "twoWay";
}
var sl = class extends f_ {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = fs(n[$], Te)),
      (this.location = vi(this._tNode, n)),
      (this.instance = on(this._tNode.index, n)[Re]),
      (this.hostView = this.changeDetectorRef = new xr(n, void 0)),
      (this.componentType = t);
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) &&
        Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let o = this._rootLView,
      i = dh(r, o[$], o, t, n);
    this.previousInputValues.set(t, n);
    let s = on(r.index, o);
    hh(s, 1);
  }
  get injector() {
    return new yo(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function rI(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var ar = (() => {
  class e {
    static __NG_ELEMENT_ID__ = oI;
  }
  return e;
})();
function oI() {
  let e = $e();
  return E_(e, G());
}
var iI = ar,
  C_ = class extends iI {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return vi(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new yo(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Yp(this._hostTNode, this._hostLView);
      if (ly(t)) {
        let n = Jc(t, this._hostLView),
          r = Kc(t),
          o = n[$].data[r + 8];
        return new yo(o, n);
      } else return new yo(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = $v(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - Ze;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Tp(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, Es(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i, s, a) {
      let c = t && !BE(t),
        l;
      if (c) l = n;
      else {
        let T = n || {};
        (l = T.index),
          (r = T.injector),
          (o = T.projectableNodes),
          (i = T.environmentInjector || T.ngModuleRef),
          (s = T.directives),
          (a = T.bindings);
      }
      let u = c ? t : new mi(Dr(t)),
        d = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let x = (c ? d : this.parentInjector).get(je, null);
        x && (i = x);
      }
      let g = Dr(u.componentType ?? {}),
        p = Tp(this._lContainer, g?.id ?? null),
        C = p?.firstChild ?? null,
        N = u.create(d, o, C, i, s, a);
      return this.insertImpl(N.hostView, l, Es(this._hostTNode, p)), N;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (ov(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[He],
            l = new C_(c, c[nn], c[He]);
          l.detach(l.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return Ml(s, o, i, r), t.attachToViewContainerRef(), If(dp(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = $v(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = ws(this._lContainer, n);
      r && (ss(dp(this._lContainer), n), Dl(r[$], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = ws(this._lContainer, n);
      return r && ss(dp(this._lContainer), n) != null ? new xr(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function $v(e) {
  return e[us];
}
function dp(e) {
  return e[us] || (e[us] = []);
}
function E_(e, t) {
  let n,
    r = t[e.index];
  return (
    _n(r) ? (n = r) : ((n = a_(r, t, null, e)), (t[e.index] = n), ih(t, n)),
    aI(n, t, e, r),
    new C_(n, e, t)
  );
}
function sI(e, t) {
  let n = e[be],
    r = n.createComment(""),
    o = bn(t, e),
    i = n.parentNode(o);
  return rl(n, i, r, n.nextSibling(o), !1), r;
}
var aI = uI,
  cI = () => !1;
function lI(e, t, n) {
  return cI(e, t, n);
}
function uI(e, t, n, r) {
  if (e[Ir]) return;
  let o;
  n.type & 8 ? (o = rn(r)) : (o = sI(t, n)), (e[Ir] = o);
}
var Rp = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  kp = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        yh(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  al = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof t == "string" ? (this.predicate = yI(t)) : (this.predicate = t);
    }
  },
  Op = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i &&
          ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  Pp = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) {
      (this.metadata = t), (this._declarationNodeIndex = n);
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-t.index, n),
          new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          this.matchTNodeWithReadOption(t, n, dI(n, i)),
            this.matchTNodeWithReadOption(t, n, qc(n, t, i, !1, !1));
        }
      else
        r === Nr
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, qc(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === _t || o === ar || (o === Nr && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let i = qc(n, t, o, !1, !1);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function dI(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function fI(e, t) {
  return e.type & 11 ? vi(e, t) : e.type & 4 ? mh(e, t) : null;
}
function pI(e, t, n, r) {
  return n === -1 ? fI(t, e) : n === -2 ? hI(e, t, r) : Cs(e, e[$], n, t);
}
function hI(e, t, n) {
  if (n === _t) return vi(t, e);
  if (n === Nr) return mh(t, e);
  if (n === ar) return E_(t, e);
}
function D_(e, t, n, r) {
  let o = t[An].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(pI(t, u, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Fp(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = D_(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = t[-c];
        for (let d = Ze; d < u.length; d++) {
          let g = u[d];
          g[wr] === g[He] && Fp(g[$], g, l, r);
        }
        if (u[ho] !== null) {
          let d = u[ho];
          for (let g = 0; g < d.length; g++) {
            let p = d[g];
            Fp(p[$], p, l, r);
          }
        }
      }
    }
  }
  return r;
}
function mI(e, t) {
  return e[An].queries[t].queryList;
}
function w_(e, t, n) {
  let r = new tl((n & 4) === 4);
  return (
    av(e, t, r, r.destroy), (t[An] ??= new kp()).queries.push(new Rp(r)) - 1
  );
}
function gI(e, t, n) {
  let r = xe();
  return (
    r.firstCreatePass &&
      (I_(r, new al(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    w_(r, G(), t)
  );
}
function vI(e, t, n, r) {
  let o = xe();
  if (o.firstCreatePass) {
    let i = $e();
    I_(o, new al(t, n, r), i.index),
      _I(o, e),
      (n & 2) === 2 && (o.staticContentQueries = !0);
  }
  return w_(o, G(), n);
}
function yI(e) {
  return e.split(",").map((t) => t.trim());
}
function I_(e, t, n) {
  e.queries === null && (e.queries = new Op()), e.queries.track(new Pp(t, n));
}
function _I(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function yh(e, t) {
  return e.queries.getByIndex(t);
}
function bI(e, t) {
  let n = e[$],
    r = yh(n, t);
  return r.crossesNgTemplate ? Fp(n, e, t, []) : D_(n, e, r, t);
}
var zv = new Set();
function jn(e) {
  zv.has(e) ||
    (zv.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Co = class {},
  xl = class {};
var cl = class extends Co {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new il(this);
    constructor(t, n, r, o = !0) {
      super(), (this.ngModuleType = t), (this._parent = n);
      let i = Tf(t);
      (this._bootstrapComponents = Py(i.bootstrap)),
        (this._r3Injector = rp(
          t,
          n,
          [
            { provide: Co, useValue: this },
            { provide: As, useValue: this.componentFactoryResolver },
            ...r,
          ],
          tr(t),
          new Set(["environment"])
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  ll = class extends xl {
    moduleType;
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new cl(this.moduleType, t, []);
    }
  };
var Is = class extends Co {
  injector;
  componentFactoryResolver = new il(this);
  instance = null;
  constructor(t) {
    super();
    let n = new ao(
      [
        ...t.providers,
        { provide: Co, useValue: this },
        { provide: As, useValue: this.componentFactoryResolver },
      ],
      t.parent || cs(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Rs(e, t, n = null) {
  return new Is({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var CI = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Nf(!1, n.type),
          o =
            r.length > 0
              ? Rs([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = w({
      token: e,
      providedIn: "environment",
      factory: () => new e(H(je)),
    });
  }
  return e;
})();
function L(e) {
  return Ts(() => {
    let t = S_(e),
      n = B(b({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Qp.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(CI).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || sr.Emulated,
        styles: e.styles || Ft,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    t.standalone && jn("NgStandalone"), M_(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Gv(r, EI)), (n.pipeDefs = Gv(r, Zg)), (n.id = II(n)), n
    );
  });
}
function EI(e) {
  return Dr(e) || xf(e);
}
function Un(e) {
  return Ts(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Ft,
    declarations: e.declarations || Ft,
    imports: e.imports || Ft,
    exports: e.exports || Ft,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function DI(e, t) {
  if (e == null) return Er;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = El.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s);
    }
  return n;
}
function wI(e) {
  if (e == null) return Er;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function de(e) {
  return Ts(() => {
    let t = S_(e);
    return M_(t), t;
  });
}
function Do(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone ?? !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function S_(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || Er,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || Ft,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: DI(e.inputs, t),
    outputs: wI(e.outputs),
    debugInfo: null,
  };
}
function M_(e) {
  e.features?.forEach((t) => t(e));
}
function Gv(e, t) {
  return e
    ? () => {
        let n = typeof e == "function" ? e() : e,
          r = [];
        for (let o of n) {
          let i = t(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function II(e) {
  let t = 0,
    n = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function SI(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function nt(e) {
  let t = SI(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (kn(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new D(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = fp(e.inputs)),
          (s.declaredInputs = fp(e.declaredInputs)),
          (s.outputs = fp(e.outputs));
        let a = o.hostBindings;
        a && AI(e, a);
        let c = o.viewQuery,
          l = o.contentQueries;
        if (
          (c && xI(e, c),
          l && NI(e, l),
          MI(e, o),
          jg(e.outputs, o.outputs),
          kn(o) && o.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === nt && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  TI(r);
}
function MI(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 &&
      ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function TI(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = pi(o.hostAttrs, (n = pi(n, o.hostAttrs))));
  }
}
function fp(e) {
  return e === Er ? {} : e === Ft ? [] : e;
}
function xI(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function NI(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function AI(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function T_(e, t, n, r, o, i, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = pi(e.mergedAttrs, e.attrs);
    let u = (e.tView = rh(
      2,
      e,
      o,
      i,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null
    ));
    n.queries !== null &&
      (n.queries.template(n, e), (u.queries = n.queries.embeddedTView(e)));
  }
  a && (e.flags |= a), ci(e, !1);
  let c = kI(n, t, e, r);
  Vc() && ch(n, t, c, e), hi(c, t);
  let l = a_(c, t, c, e);
  (t[r + Te] = l), ih(t, l), lI(l, e, t);
}
function RI(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + Te,
    g;
  return (
    t.firstCreatePass
      ? ((g = Ns(t, d, 4, s || null, a || null)),
        Wf() && h_(t, e, g, sn(t.consts, l), Yy),
        sy(t, g))
      : (g = t.data[d]),
    T_(g, e, t, n, r, o, i, c),
    ds(g) && uh(t, e, g),
    l != null && Il(e, g, u),
    g
  );
}
function ul(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + Te,
    g;
  if (t.firstCreatePass) {
    if (((g = Ns(t, d, 4, s || null, a || null)), l != null)) {
      let p = sn(t.consts, l);
      g.localNames = [];
      for (let C = 0; C < p.length; C += 2) g.localNames.push(p[C], -1);
    }
  } else g = t.data[d];
  return T_(g, e, t, n, r, o, i, c), l != null && Il(e, g, u), g;
}
function Nl(e, t, n, r, o, i, s, a) {
  let c = G(),
    l = xe(),
    u = sn(l.consts, i);
  return RI(c, l, e, t, n, r, o, u, void 0, s, a), Nl;
}
var kI = OI;
function OI(e, t, n, r) {
  return jc(!0), t[be].createComment("");
}
var Al = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(Al || {}),
  wo = new M(""),
  x_ = !1,
  Lp = class extends Ae {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        ev() &&
          ((this.destroyRef = f(Tt, { optional: !0 }) ?? void 0),
          (this.pendingTasks = f(Pn, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = z(null);
      try {
        super.next(t);
      } finally {
        z(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof Ie && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(n);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  De = Lp;
function N_(e) {
  let t, n;
  function r() {
    e = go;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function Wv(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = go;
    }
  );
}
var _h = "isAngularZone",
  dl = _h + "_ID",
  PI = 0,
  Pe = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new De(!1);
    onMicrotaskEmpty = new De(!1);
    onStable = new De(!1);
    onError = new De(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = x_,
      } = t;
      if (typeof Zone > "u") throw new D(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        VI(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(_h) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new D(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new D(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, FI, go, go);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  FI = {};
function bh(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function LI(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    N_(() => {
      (e.callbackScheduled = !1),
        Vp(e),
        (e.isCheckStableRunning = !0),
        bh(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Vp(e);
}
function VI(e) {
  let t = () => {
      LI(e);
    },
    n = PI++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [_h]: !0, [dl]: n, [dl + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (jI(c)) return r.invokeTask(i, s, a, c);
      try {
        return qv(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Zv(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return qv(e), r.invoke(i, s, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !UI(c) &&
          t(),
          Zv(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Vp(e), bh(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Vp(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function qv(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Zv(e) {
  e._nesting--, bh(e);
}
var Ss = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new De();
  onMicrotaskEmpty = new De();
  onStable = new De();
  onError = new De();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function jI(e) {
  return A_(e, "__ignore_ng_zone__");
}
function UI(e) {
  return A_(e, "__scheduler_tick__");
}
function A_(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Ch = (() => {
    class e {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = w({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  R_ = [0, 1, 2, 3],
  k_ = (() => {
    class e {
      ngZone = f(Pe);
      scheduler = f(en);
      errorHandler = f(Lt, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        f(wo, { optional: !0 });
      }
      execute() {
        let n = this.sequences.size > 0;
        n && ue(16), (this.executing = !0);
        for (let r of R_)
          for (let o of this.sequences)
            if (!(o.erroredOrDestroyed || !o.hooks[r]))
              try {
                o.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let i = o.hooks[r];
                    return i(o.pipelinedValue);
                  }, o.snapshot)
                );
              } catch (i) {
                (o.erroredOrDestroyed = !0), this.errorHandler?.handleError(i);
              }
        this.executing = !1;
        for (let r of this.sequences)
          r.afterRun(), r.once && (this.sequences.delete(r), r.destroy());
        for (let r of this.deferredRegistrations) this.sequences.add(r);
        this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          n && ue(17);
      }
      register(n) {
        let { view: r } = n;
        r !== void 0
          ? ((r[po] ??= []).push(n), Mr(r), (r[W] |= 8192))
          : this.executing
          ? this.deferredRegistrations.add(n)
          : this.addSequence(n);
      }
      addSequence(n) {
        this.sequences.add(n), this.scheduler.notify(7);
      }
      unregister(n) {
        this.executing && this.sequences.has(n)
          ? ((n.erroredOrDestroyed = !0),
            (n.pipelinedValue = void 0),
            (n.once = !0))
          : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
      }
      maybeTrace(n, r) {
        return r ? r.run(Al.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = w({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  fl = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, o, i, s = null) {
      (this.impl = t),
        (this.hooks = n),
        (this.view = r),
        (this.once = o),
        (this.snapshot = s),
        (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()));
    }
    afterRun() {
      (this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null);
    }
    destroy() {
      this.impl.unregister(this), this.unregisterOnDestroy?.();
      let t = this.view?.[po];
      t && (this.view[po] = t.filter((n) => n !== this));
    }
  };
function ks(e, t) {
  let n = t?.injector ?? f(gt);
  return jn("NgAfterNextRender"), HI(e, n, t, !0);
}
function BI(e) {
  return e instanceof Function
    ? [void 0, void 0, e, void 0]
    : [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function HI(e, t, n, r) {
  let o = t.get(Ch);
  o.impl ??= t.get(k_);
  let i = t.get(wo, null, { optional: !0 }),
    s = n?.manualCleanup !== !0 ? t.get(Tt) : null,
    a = t.get(ui, null, { optional: !0 }),
    c = new fl(o.impl, BI(e), a?.view, r, s, i?.snapshot(null));
  return o.impl.register(c), c;
}
var Eh = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" });
  }
  return e;
})();
var Dh = new M("");
function Ar(e) {
  return !!e && typeof e.then == "function";
}
function wh(e) {
  return !!e && typeof e.subscribe == "function";
}
var Ih = new M("");
function Rl(e) {
  return xn([{ provide: Ih, multi: !0, useValue: e }]);
}
var Sh = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        (this.resolve = n), (this.reject = r);
      });
      appInits = f(Ih, { optional: !0 }) ?? [];
      injector = f(gt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = qe(this.injector, o);
          if (Ar(i)) n.push(i);
          else if (wh(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  kl = new M("");
function O_() {
  Od(() => {
    let e = "";
    throw new D(600, e);
  });
}
function P_(e) {
  return e.isBoundToModule;
}
var $I = 10;
var cr = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = f(yt);
    afterRenderManager = f(Ch);
    zonelessEnabled = f(gs);
    rootEffectScheduler = f(ys);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new Ae();
    get allViews() {
      return [
        ...(this.includeAllTestViews
          ? this.allTestViews
          : this.autoDetectTestViews
        ).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = f(Pn);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(
        J((n) => !n)
      );
    }
    constructor() {
      f(wo, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = f(je);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = gt.NULL) {
      return this._injector.get(Pe).run(() => {
        ue(10);
        let s = n instanceof Tl;
        if (!this._injector.get(Sh).done) {
          let C = "";
          throw new D(405, C);
        }
        let c;
        s ? (c = n) : (c = this._injector.get(As).resolveComponentFactory(n)),
          this.componentTypes.push(c.componentType);
        let l = P_(c) ? void 0 : this._injector.get(Co),
          u = r || c.selector,
          d = c.create(o, [], u, l),
          g = d.location.nativeElement,
          p = d.injector.get(Dh, null);
        return (
          p?.registerApplication(g),
          d.onDestroy(() => {
            this.detachView(d.hostView),
              bs(this.components, d),
              p?.unregisterApplication(g);
          }),
          this._loadComponent(d),
          ue(11, d),
          d
        );
      });
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      ue(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Al.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl();
    }
    tickImpl = () => {
      if (this._runningTick) throw new D(101, !1);
      let n = z(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } finally {
        (this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          z(n),
          this.afterTick.next(),
          ue(13);
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(bo, null, {
          optional: !0,
        }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < $I; )
        ue(14), this.synchronizeOnce(), ue(15);
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 &&
        ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: o } of this.allViews) {
          if (!r && !ps(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          ph(o, i), (n = !0);
        }
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      }
      n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 &&
          ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => ps(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      bs(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      this.components.push(n), this._injector.get(kl, []).forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => bs(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new D(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function bs(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function an(e, t, n, r) {
  let o = G(),
    i = ir();
  if (Ut(o, i, t)) {
    let s = xe(),
      a = ms();
    aw(a, o, e, t, n, r);
  }
  return an;
}
var Mh = new M("", { providedIn: "root", factory: () => !1 }),
  Th = new M("", { providedIn: "root", factory: () => zI }),
  zI = 4e3;
var DV =
  typeof document < "u" &&
  typeof document?.documentElement?.getAnimations == "function";
var jp = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function pp(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function GI(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; i <= s && i <= c; ) {
      let l = e.at(i),
        u = t[i],
        d = pp(i, l, i, u, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let g = e.at(s),
        p = t[c],
        C = pp(s, g, c, p, n);
      if (C !== 0) {
        C < 0 && e.updateValue(s, p), s--, c--;
        continue;
      }
      let N = n(i, l),
        T = n(s, g),
        x = n(i, u);
      if (Object.is(x, T)) {
        let Ve = n(c, p);
        Object.is(Ve, N)
          ? (e.swap(i, s), e.updateValue(s, p), c--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++;
        continue;
      }
      if (((r ??= new pl()), (o ??= Qv(e, i, s, n)), Up(e, r, i, x)))
        e.updateValue(i, u), i++, s++;
      else if (o.has(x)) r.set(N, e.detach(i)), s--;
      else {
        let Ve = e.create(i, t[i]);
        e.attach(i, Ve), i++, s++;
      }
    }
    for (; i <= c; ) Yv(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        g = pp(i, u, i, d, n);
      if (g !== 0) g < 0 && e.updateValue(i, d), i++, (l = c.next());
      else {
        (r ??= new pl()), (o ??= Qv(e, i, s, n));
        let p = n(i, d);
        if (Up(e, r, i, p)) e.updateValue(i, d), i++, s++, (l = c.next());
        else if (!o.has(p))
          e.attach(i, e.create(i, d)), i++, s++, (l = c.next());
        else {
          let C = n(i, u);
          r.set(C, e.detach(i)), s--;
        }
      }
    }
    for (; !l.done; ) Yv(e, r, n, e.length, l.value), (l = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Up(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Yv(e, t, n, r, o) {
  if (Up(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Qv(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var pl = class {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function P(e, t, n, r, o, i, s, a) {
  jn("NgControlFlow");
  let c = G(),
    l = xe(),
    u = sn(l.consts, i);
  return ul(c, l, e, t, n, r, o, u, 256, s, a), xh;
}
function xh(e, t, n, r, o, i, s, a) {
  jn("NgControlFlow");
  let c = G(),
    l = xe(),
    u = sn(l.consts, i);
  return ul(c, l, e, t, n, r, o, u, 512, s, a), xh;
}
function F(e, t) {
  jn("NgControlFlow");
  let n = G(),
    r = ir(),
    o = n[r] !== pt ? n[r] : -1,
    i = o !== -1 ? hl(n, Te + o) : void 0,
    s = 0;
  if (Ut(n, r, e)) {
    let a = z(null);
    try {
      if ((i !== void 0 && l_(i, s), e !== -1)) {
        let c = Te + e,
          l = hl(n, c),
          u = zp(n[$], c),
          d = d_(l, u, n),
          g = Sl(n, u, t, { dehydratedView: d });
        Ml(l, g, s, Es(u, d));
      }
    } finally {
      z(a);
    }
  } else if (i !== void 0) {
    let a = c_(i, s);
    a !== void 0 && (a[Re] = t);
  }
}
var Bp = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - Ze;
  }
};
function rt(e) {
  return e;
}
var Hp = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function ge(e, t, n, r, o, i, s, a, c, l, u, d, g) {
  jn("NgControlFlow");
  let p = G(),
    C = xe(),
    N = c !== void 0,
    T = G(),
    x = a ? s.bind(T[Vt][Re]) : s,
    Ve = new Hp(N, x);
  (T[Te + e] = Ve),
    ul(p, C, e + 1, t, n, r, o, sn(C.consts, i), 256),
    N && ul(p, C, e + 2, c, l, u, d, sn(C.consts, g), 512);
}
var $p = class extends jp {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r);
  }
  get length() {
    return this.lContainer.length - Ze;
  }
  at(t) {
    return this.getLView(t)[Re].$implicit;
  }
  attach(t, n) {
    let r = n[oi];
    (this.needsIndexUpdate ||= t !== this.length),
      Ml(this.lContainer, n, t, Es(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), WI(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Tp(this.lContainer, this.templateTNode.tView.ssrId),
      o = Sl(
        this.hostLView,
        this.templateTNode,
        new Bp(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Dl(t[$], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[Re].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[Re].$index = t;
  }
  getLView(t) {
    return qI(this.lContainer, t);
  }
};
function ve(e) {
  let t = z(null),
    n = On();
  try {
    let r = G(),
      o = r[$],
      i = r[n],
      s = n + 1,
      a = hl(r, s);
    if (i.liveCollection === void 0) {
      let l = zp(o, s);
      i.liveCollection = new $p(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((GI(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = ir(),
        u = c.length === 0;
      if (Ut(r, l, u)) {
        let d = n + 2,
          g = hl(r, d);
        if (u) {
          let p = zp(o, d),
            C = d_(g, p, r),
            N = Sl(r, p, void 0, { dehydratedView: C });
          Ml(g, N, 0, Es(p, C));
        } else o.firstUpdatePass && Rw(g), l_(g, 0);
      }
    }
  } finally {
    z(t);
  }
}
function hl(e, t) {
  return e[t];
}
function WI(e, t) {
  return ws(e, t);
}
function qI(e, t) {
  return c_(e, t);
}
function zp(e, t) {
  return fs(e, t);
}
function Z(e, t, n) {
  let r = G(),
    o = ir();
  if (Ut(r, o, t)) {
    let i = xe(),
      s = ms();
    qy(s, r, e, t, r[be], n);
  }
  return Z;
}
function Kv(e, t, n, r, o) {
  dh(t, e, n, o ? "class" : "style", r);
}
function h(e, t, n, r) {
  let o = G(),
    i = o[$],
    s = e + Te,
    a = i.firstCreatePass ? g_(s, o, 2, t, Yy, Wf(), n, r) : i.data[s];
  if ((Qy(a, o, e, t, F_), ds(a))) {
    let c = o[$];
    uh(c, o, a), Ny(c, a, o);
  }
  return r != null && Il(o, a), h;
}
function m() {
  let e = xe(),
    t = $e(),
    n = Ky(t);
  return (
    e.firstCreatePass && v_(e, n),
    qf(n) && Zf(),
    Gf(),
    n.classesWithoutHost != null &&
      qE(n) &&
      Kv(e, n, G(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null &&
      ZE(n) &&
      Kv(e, n, G(), n.stylesWithoutHost, !1),
    m
  );
}
function U(e, t, n, r) {
  return h(e, t, n, r), m(), U;
}
function A(e, t, n, r) {
  let o = G(),
    i = o[$],
    s = e + Te,
    a = i.firstCreatePass ? Ww(s, i, 2, t, n, r) : i.data[s];
  return Qy(a, o, e, t, F_), r != null && Il(o, a), A;
}
function R() {
  let e = $e(),
    t = Ky(e);
  return qf(t) && Zf(), Gf(), R;
}
function xt(e, t, n, r) {
  return A(e, t, n, r), R(), xt;
}
var F_ = (e, t, n, r, o) => (jc(!0), Ly(t[be], r, Dv()));
function Y() {
  return G();
}
function bt(e, t, n) {
  let r = G(),
    o = ir();
  if (Ut(r, o, t)) {
    let i = xe(),
      s = ms();
    Zy(s, r, e, t, r[be], n);
  }
  return bt;
}
var vo = void 0;
function ZI(e) {
  let t = Math.floor(Math.abs(e)),
    n = e.toString().replace(/^[^.]*\.?/, "").length;
  return t === 1 && n === 0 ? 1 : 5;
}
var YI = [
    "en",
    [["a", "p"], ["AM", "PM"], vo],
    [["AM", "PM"], vo, vo],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    vo,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    vo,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", vo, "{1} 'at' {0}", vo],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    ZI,
  ],
  hp = {};
function Ht(e) {
  let t = QI(e),
    n = Jv(t);
  if (n) return n;
  let r = t.split("-")[0];
  if (((n = Jv(r)), n)) return n;
  if (r === "en") return YI;
  throw new D(701, !1);
}
function Jv(e) {
  return (
    e in hp ||
      (hp[e] =
        nr.ng &&
        nr.ng.common &&
        nr.ng.common.locales &&
        nr.ng.common.locales[e]),
    hp[e]
  );
}
var Fe = (function (e) {
  return (
    (e[(e.LocaleId = 0)] = "LocaleId"),
    (e[(e.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (e[(e.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (e[(e.DaysFormat = 3)] = "DaysFormat"),
    (e[(e.DaysStandalone = 4)] = "DaysStandalone"),
    (e[(e.MonthsFormat = 5)] = "MonthsFormat"),
    (e[(e.MonthsStandalone = 6)] = "MonthsStandalone"),
    (e[(e.Eras = 7)] = "Eras"),
    (e[(e.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (e[(e.WeekendRange = 9)] = "WeekendRange"),
    (e[(e.DateFormat = 10)] = "DateFormat"),
    (e[(e.TimeFormat = 11)] = "TimeFormat"),
    (e[(e.DateTimeFormat = 12)] = "DateTimeFormat"),
    (e[(e.NumberSymbols = 13)] = "NumberSymbols"),
    (e[(e.NumberFormats = 14)] = "NumberFormats"),
    (e[(e.CurrencyCode = 15)] = "CurrencyCode"),
    (e[(e.CurrencySymbol = 16)] = "CurrencySymbol"),
    (e[(e.CurrencyName = 17)] = "CurrencyName"),
    (e[(e.Currencies = 18)] = "Currencies"),
    (e[(e.Directionality = 19)] = "Directionality"),
    (e[(e.PluralCase = 20)] = "PluralCase"),
    (e[(e.ExtraData = 21)] = "ExtraData"),
    e
  );
})(Fe || {});
function QI(e) {
  return e.toLowerCase().replace(/_/g, "-");
}
var Os = "en-US";
var KI = Os;
function L_(e) {
  typeof e == "string" && (KI = e.toLowerCase().replace(/_/g, "-"));
}
function O(e, t, n) {
  let r = G(),
    o = xe(),
    i = $e();
  return V_(o, r, r[be], i, e, t, n), O;
}
function ie(e, t, n) {
  let r = G(),
    o = xe(),
    i = $e();
  return (i.type & 3 || n) && y_(i, o, r, n, r[be], e, t, Yc(i, r, t)), ie;
}
function V_(e, t, n, r, o, i, s) {
  let a = !0,
    c = null;
  if (
    ((r.type & 3 || s) &&
      ((c ??= Yc(r, t, i)), y_(r, e, t, s, n, o, i, c) && (a = !1)),
    a)
  ) {
    let l = r.outputs?.[o],
      u = r.hostDirectiveOutputs?.[o];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let g = u[d],
          p = u[d + 1];
        (c ??= Yc(r, t, i)), Bv(r, t, g, p, o, c);
      }
    if (l && l.length)
      for (let d of l) (c ??= Yc(r, t, i)), Bv(r, t, d, o, o, c);
  }
}
function E(e = 1) {
  return Ev(e);
}
function Nh(e, t, n, r) {
  vI(e, t, n, r);
}
function $t(e, t, n) {
  gI(e, t, n);
}
function Ct(e) {
  let t = G(),
    n = xe(),
    r = ep();
  Pc(r + 1);
  let o = yh(n, r);
  if (e.dirty && rv(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = bI(t, r);
      e.reset(i, aD), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Et() {
  return mI(G(), ep());
}
function Ah(e) {
  let t = pv();
  return xc(t, Te + e);
}
function zc(e, t) {
  return (e << 17) | (t << 2);
}
function Eo(e) {
  return (e >> 17) & 32767;
}
function JI(e) {
  return (e & 2) == 2;
}
function XI(e, t) {
  return (e & 131071) | (t << 17);
}
function Gp(e) {
  return e | 2;
}
function gi(e) {
  return (e & 131068) >> 2;
}
function mp(e, t) {
  return (e & -131069) | (t << 2);
}
function eS(e) {
  return (e & 1) === 1;
}
function Wp(e) {
  return e | 1;
}
function tS(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = Eo(s),
    c = gi(s);
  e[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || ri(d, u) > 0) && (l = !0);
  } else u = n;
  if (o)
    if (c !== 0) {
      let g = Eo(e[a + 1]);
      (e[r + 1] = zc(g, a)),
        g !== 0 && (e[g + 1] = mp(e[g + 1], r)),
        (e[a + 1] = XI(e[a + 1], r));
    } else
      (e[r + 1] = zc(a, 0)), a !== 0 && (e[a + 1] = mp(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = zc(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = mp(e[c + 1], r)),
      (c = r);
  l && (e[r + 1] = Gp(e[r + 1])),
    Xv(e, u, r, !0),
    Xv(e, u, r, !1),
    nS(t, u, e, r, i),
    (s = zc(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function nS(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    ri(i, t) >= 0 &&
    (n[r + 1] = Wp(n[r + 1]));
}
function Xv(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? Eo(o) : gi(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    rS(c, t) && ((a = !0), (e[s + 1] = r ? Wp(l) : Gp(l))),
      (s = r ? Eo(l) : gi(l));
  }
  a && (e[n + 1] = r ? Gp(o) : Wp(o));
}
function rS(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? ri(e, t) >= 0
    : !1;
}
function fe(e, t) {
  return oS(e, t, null, !0), fe;
}
function oS(e, t, n, r) {
  let o = G(),
    i = xe(),
    s = kc(2);
  if ((i.firstUpdatePass && sS(i, e, s, r), t !== pt && Ut(o, s, t))) {
    let a = i.data[On()];
    dS(i, a, o, o[be], e, (o[s + 1] = fS(t, n)), r, s);
  }
}
function iS(e, t) {
  return t >= e.expandoStartIndex;
}
function sS(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[On()],
      s = iS(e, n);
    pS(i, r) && t === null && !s && (t = !1),
      (t = aS(o, i, t, r)),
      tS(o, i, t, n, s, r);
  }
}
function aS(e, t, n, r) {
  let o = yv(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = gp(null, e, t, n, r)), (n = Ms(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = gp(o, e, t, n, r)), i === null)) {
        let c = cS(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = gp(null, e, t, c[1], r)),
          (c = Ms(c, t.attrs, r)),
          lS(e, t, r, c));
      } else i = uS(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function cS(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (gi(r) !== 0) return e[Eo(r)];
}
function lS(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[Eo(o)] = r;
}
function uS(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Ms(r, s, n);
  }
  return Ms(r, t.attrs, n);
}
function gp(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Ms(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Ms(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          qg(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function dS(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = eS(l) ? ey(c, t, n, o, gi(l), s) : void 0;
  if (!ml(u)) {
    ml(i) || (JI(l) && (i = ey(c, null, n, o, a, s)));
    let d = Vf(On(), n);
    JD(r, s, d, o, i);
  }
}
function ey(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      g = n[o + 1];
    g === pt && (g = d ? Ft : void 0);
    let p = d ? Mc(g, r) : u === r ? g : void 0;
    if ((l && !ml(p) && (p = Mc(c, r)), ml(p) && ((a = p), s))) return a;
    let C = e[o + 1];
    o = s ? Eo(C) : gi(C);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Mc(c, r));
  }
  return a;
}
function ml(e) {
  return e !== void 0;
}
function fS(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = tr(bl(e)))),
    e
  );
}
function pS(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function y(e, t = "") {
  let n = G(),
    r = xe(),
    o = e + Te,
    i = r.firstCreatePass ? Ns(r, o, 1, t, null) : r.data[o],
    s = hS(r, n, i, t, e);
  (n[o] = s), Vc() && ch(r, n, s, i), ci(i, !1);
}
var hS = (e, t, n, r, o) => (jc(!0), RD(t[be], r));
function j_(e, t, n, r = "") {
  return Ut(e, ir(), n) ? t + vn(n) + r : pt;
}
function mS(e, t, n, r, o, i = "") {
  let s = Xf(),
    a = vh(e, s, n, o);
  return kc(2), a ? t + vn(n) + r + vn(o) + i : pt;
}
function gS(e, t, n, r, o, i, s, a = "") {
  let c = Xf(),
    l = Zw(e, c, n, o, s);
  return kc(3), l ? t + vn(n) + r + vn(o) + i + vn(s) + a : pt;
}
function oe(e) {
  return Ce("", e), oe;
}
function Ce(e, t, n) {
  let r = G(),
    o = j_(r, e, t, n);
  return o !== pt && Rh(r, On(), o), Ce;
}
function Bn(e, t, n, r, o) {
  let i = G(),
    s = mS(i, e, t, n, r, o);
  return s !== pt && Rh(i, On(), s), Bn;
}
function Ol(e, t, n, r, o, i, s) {
  let a = G(),
    c = gS(a, e, t, n, r, o, i, s);
  return c !== pt && Rh(a, On(), c), Ol;
}
function Rh(e, t, n) {
  let r = Vf(t, e);
  kD(e[be], r, n);
}
function Ye(e, t, n) {
  sp(t) && (t = t());
  let r = G(),
    o = ir();
  if (Ut(r, o, t)) {
    let i = xe(),
      s = ms();
    qy(s, r, e, t, r[be], n);
  }
  return Ye;
}
function ot(e, t) {
  let n = sp(e);
  return n && e.set(t), n;
}
function Qe(e, t) {
  let n = G(),
    r = xe(),
    o = $e();
  return V_(r, n, n[be], o, e, t), Qe;
}
function Dn(e) {
  return Ut(G(), ir(), e) ? vn(e) : pt;
}
function Rr(e, t, n = "") {
  return j_(G(), e, t, n);
}
function vS(e, t, n) {
  let r = xe();
  if (r.firstCreatePass) {
    let o = kn(e);
    qp(n, r.data, r.blueprint, o, !0), qp(t, r.data, r.blueprint, o, !1);
  }
}
function qp(e, t, n, r, o) {
  if (((e = tt(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) qp(e[i], t, n, r, o);
  else {
    let i = xe(),
      s = G(),
      a = $e(),
      c = so(e) ? e : tt(e.provide),
      l = Rf(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      g = a.providerIndexes >> 20;
    if (so(e) || !e.multi) {
      let p = new _o(l, o, k, null),
        C = yp(c, t, o ? u : u + g, d);
      C === -1
        ? (bp(el(a, s), i, c),
          vp(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(p),
          s.push(p))
        : ((n[C] = p), (s[C] = p));
    } else {
      let p = yp(c, t, u + g, d),
        C = yp(c, t, u, u + g),
        N = p >= 0 && n[p],
        T = C >= 0 && n[C];
      if ((o && !T) || (!o && !N)) {
        bp(el(a, s), i, c);
        let x = bS(o ? _S : yS, n.length, o, r, l, e);
        !o && T && (n[C].providerFactory = x),
          vp(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(x),
          s.push(x);
      } else {
        let x = U_(n[o ? C : p], l, !o && r);
        vp(i, e, p > -1 ? p : C, x);
      }
      !o && r && T && n[C].componentProviders++;
    }
  }
}
function vp(e, t, n, r) {
  let o = so(t),
    i = Xg(t);
  if (o || i) {
    let c = (i ? tt(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function U_(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function yp(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function yS(e, t, n, r, o) {
  return Zp(this.multi, []);
}
function _S(e, t, n, r, o) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      c = Cs(r, r[$], this.providerFactory.index, o);
    (s = c.slice(0, a)), Zp(i, s);
    for (let l = a; l < c.length; l++) s.push(c[l]);
  } else (s = []), Zp(i, s);
  return s;
}
function Zp(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function bS(e, t, n, r, o, i) {
  let s = new _o(e, n, k, null);
  return (
    (s.multi = []),
    (s.index = t),
    (s.componentProviders = 0),
    U_(s, o, r && !n),
    s
  );
}
function zt(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => vS(r, o ? o(e) : e, t);
  };
}
function Ps(e, t, n) {
  let r = Rc() + e,
    o = G();
  return o[r] === pt ? gh(o, r, n ? t.call(n) : t()) : qw(o, r);
}
function B_(e, t) {
  let n = e[t];
  return n === pt ? void 0 : n;
}
function CS(e, t, n, r, o, i) {
  let s = t + n;
  return Ut(e, s, o) ? gh(e, s + 1, i ? r.call(i, o) : r(o)) : B_(e, s + 1);
}
function ES(e, t, n, r, o, i, s) {
  let a = t + n;
  return vh(e, a, o, i)
    ? gh(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : B_(e, a + 2);
}
function Gt(e, t) {
  let n = xe(),
    r,
    o = e + Te;
  n.firstCreatePass
    ? ((r = DS(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = _r(r.type, !0)),
    s,
    a = mt(k);
  try {
    let c = Xc(!1),
      l = i();
    return Xc(c), jf(n, G(), o, l), l;
  } finally {
    mt(a);
  }
}
function DS(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function lr(e, t, n) {
  let r = e + Te,
    o = G(),
    i = xc(o, r);
  return H_(o, r) ? CS(o, Rc(), t, i.transform, n, i) : i.transform(n);
}
function Io(e, t, n, r) {
  let o = e + Te,
    i = G(),
    s = xc(i, o);
  return H_(i, o) ? ES(i, Rc(), t, s.transform, n, r, s) : s.transform(n, r);
}
function H_(e, t) {
  return e[$].data[t].pure;
}
var gl = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  kh = (() => {
    class e {
      compileModuleSync(n) {
        return new ll(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Tf(n),
          i = Py(o.declarations).reduce((s, a) => {
            let c = Dr(a);
            return c && s.push(new mi(c)), s;
          }, []);
        return new gl(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var wS = (() => {
  class e {
    zone = f(Pe);
    changeDetectionScheduler = f(en);
    applicationRef = f(cr);
    applicationErrorHandler = f(yt);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  try {
                    (this.applicationRef.dirtyFlags |= 1),
                      this.applicationRef._tick();
                  } catch (n) {
                    this.applicationErrorHandler(n);
                  }
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function $_({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new Pe(B(b({}, z_()), { scheduleInRootZone: n }))),
    [
      { provide: Pe, useFactory: e },
      {
        provide: rr,
        multi: !0,
        useFactory: () => {
          let r = f(wS, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: rr,
        multi: !0,
        useFactory: () => {
          let r = f(IS);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: ap, useValue: !0 } : [],
      { provide: Hc, useValue: n ?? x_ },
      {
        provide: yt,
        useFactory: () => {
          let r = f(Pe),
            o = f(je),
            i;
          return (s) => {
            r.runOutsideAngular(() => {
              o.destroyed && !i
                ? setTimeout(() => {
                    throw s;
                  })
                : ((i ??= o.get(Lt)), i.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function z_(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var IS = (() => {
  class e {
    subscription = new Ie();
    initialized = !1;
    zone = f(Pe);
    pendingTasks = f(Pn);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              Pe.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            Pe.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var Oh = (() => {
  class e {
    applicationErrorHandler = f(yt);
    appRef = f(cr);
    taskService = f(Pn);
    ngZone = f(Pe);
    zonelessEnabled = f(gs);
    tracing = f(wo, { optional: !0 });
    disableScheduling = f(ap, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new Ie();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(dl) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (f(Hc, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Ss || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 12: {
          (this.appRef.dirtyFlags |= 16), (r = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? Wv : N_;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick())
            ));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(dl + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        this.taskService.remove(n), this.applicationErrorHandler(r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Wv(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function Ph() {
  return (
    jn("NgZoneless"),
    xn([
      { provide: en, useExisting: Oh },
      { provide: Pe, useClass: Ss },
      { provide: gs, useValue: !0 },
      { provide: Hc, useValue: !1 },
      [],
    ])
  );
}
function SS() {
  return (typeof $localize < "u" && $localize.locale) || Os;
}
var Fs = new M("", {
  providedIn: "root",
  factory: () => f(Fs, { optional: !0, skipSelf: !0 }) || SS(),
});
var Ls = class {
  destroyed = !1;
  listeners = null;
  errorHandler = f(Lt, { optional: !0 });
  destroyRef = f(Tt);
  constructor() {
    this.destroyRef.onDestroy(() => {
      (this.destroyed = !0), (this.listeners = null);
    });
  }
  subscribe(t) {
    if (this.destroyed) throw new D(953, !1);
    return (
      (this.listeners ??= []).push(t),
      {
        unsubscribe: () => {
          let n = this.listeners?.indexOf(t);
          n !== void 0 && n !== -1 && this.listeners?.splice(n, 1);
        },
      }
    );
  }
  emit(t) {
    if (this.destroyed) {
      console.warn(Cr(953, !1));
      return;
    }
    if (this.listeners === null) return;
    let n = z(null);
    try {
      for (let r of this.listeners)
        try {
          r(t);
        } catch (o) {
          this.errorHandler?.handleError(o);
        }
    } finally {
      z(n);
    }
  }
};
function ze(e) {
  return Og(e);
}
function Dt(e, t) {
  return $a(e, t?.equal);
}
var Fh = class {
  [Xe];
  constructor(t) {
    this[Xe] = t;
  }
  destroy() {
    this[Xe].destroy();
  }
};
function Lh(e, t) {
  let n = t?.injector ?? f(gt),
    r = t?.manualCleanup !== !0 ? n.get(Tt) : null,
    o,
    i = n.get(ui, null, { optional: !0 }),
    s = n.get(en);
  return (
    i !== null
      ? ((o = xS(i.view, s, e)),
        r instanceof os && r._lView === i.view && (r = null))
      : (o = NS(e, n.get(ys), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())),
    new Fh(o)
  );
}
var G_ = B(b({}, Pg), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFn: go,
    run() {
      let e = li(!1);
      try {
        Fg(this);
      } finally {
        li(e);
      }
    },
    cleanup() {
      if (!this.cleanupFns?.length) return;
      let e = z(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        (this.cleanupFns = []), z(e);
      }
    },
  }),
  MS = B(b({}, G_), {
    consumerMarkedDirty() {
      this.scheduler.schedule(this), this.notifier.notify(12);
    },
    destroy() {
      Kr(this), this.onDestroyFn(), this.cleanup(), this.scheduler.remove(this);
    },
  }),
  TS = B(b({}, G_), {
    consumerMarkedDirty() {
      (this.view[W] |= 8192), Mr(this.view), this.notifier.notify(13);
    },
    destroy() {
      Kr(this), this.onDestroyFn(), this.cleanup(), this.view[or]?.delete(this);
    },
  });
function xS(e, t, n) {
  let r = Object.create(TS);
  return (
    (r.view = e),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    (r.notifier = t),
    (r.fn = W_(r, n)),
    (e[or] ??= new Set()),
    e[or].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function NS(e, t, n) {
  let r = Object.create(MS);
  return (
    (r.fn = W_(r, e)),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
function W_(e, t) {
  return () => {
    t((n) => (e.cleanupFns ??= []).push(n));
  };
}
var Ll = Symbol("InputSignalNode#UNSET"),
  Q_ = B(b({}, za), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      Jr(e, t);
    },
  });
function K_(e, t) {
  let n = Object.create(Q_);
  (n.value = e), (n.transformFn = t?.transform);
  function r() {
    if ((Yr(n), n.value === Ll)) {
      let o = null;
      throw new D(-950, o);
    }
    return n.value;
  }
  return (r[Xe] = n), r;
}
var Fl = class {
    attributeName;
    constructor(t) {
      this.attributeName = t;
    }
    __NG_ELEMENT_ID__ = () => xs(this.attributeName);
    toString() {
      return `HostAttributeToken ${this.attributeName}`;
    }
  },
  $S = new M("");
$S.__NG_ELEMENT_ID__ = (e) => {
  let t = $e();
  if (t === null) throw new D(204, !1);
  if (t.type & 2) return t.value;
  if (e & 8) return null;
  throw new D(204, !1);
};
function Wt(e) {
  return new Ls();
}
function q_(e, t) {
  return K_(e, t);
}
function zS(e) {
  return K_(Ll, e);
}
var Le = ((q_.required = zS), q_);
function J_(e, t) {
  let n = Object.create(Q_),
    r = new Ls();
  n.value = e;
  function o() {
    return Yr(n), Z_(n.value), n.value;
  }
  return (
    (o[Xe] = n),
    (o.asReadonly = Bc.bind(o)),
    (o.set = (i) => {
      n.equal(n.value, i) || (Jr(n, i), r.emit(i));
    }),
    (o.update = (i) => {
      Z_(n.value), o.set(i(n.value));
    }),
    (o.subscribe = r.subscribe.bind(r)),
    (o.destroyRef = r.destroyRef),
    o
  );
}
function Z_(e) {
  if (e === Ll) throw new D(952, !1);
}
function Y_(e, t) {
  return J_(e, t);
}
function GS(e) {
  return J_(Ll, e);
}
var js = ((Y_.required = GS), Y_);
var Vh = new M(""),
  WS = new M("");
function Vs(e) {
  return !e.moduleRef;
}
function qS(e) {
  let t = Vs(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(Pe);
  return n.run(() => {
    Vs(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(yt),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: r });
      }),
      Vs(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Vh);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Vh);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          bs(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return YS(r, n, () => {
      let i = t.get(Pn),
        s = i.add(),
        a = t.get(Sh);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = t.get(Fs, Os);
            if ((L_(c || Os), !t.get(WS, !0)))
              return Vs(e)
                ? t.get(cr)
                : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (Vs(e)) {
              let u = t.get(cr);
              return (
                e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u
              );
            } else return ZS?.(e.moduleRef, e.allPlatformModules), e.moduleRef;
          })
          .finally(() => void i.remove(s))
      );
    });
  });
}
var ZS;
function YS(e, t, n) {
  try {
    let r = n();
    return Ar(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var Pl = null;
function QS(e = [], t) {
  return gt.create({
    name: t,
    providers: [
      { provide: as, useValue: "platform" },
      { provide: Vh, useValue: new Set([() => (Pl = null)]) },
      ...e,
    ],
  });
}
function KS(e = []) {
  if (Pl) return Pl;
  let t = QS(e);
  return (Pl = t), O_(), JS(t), t;
}
function JS(e) {
  let t = e.get(yl, null);
  qe(e, () => {
    t?.forEach((n) => n());
  });
}
var kr = (() => {
  class e {
    static __NG_ELEMENT_ID__ = XS;
  }
  return e;
})();
function XS(e) {
  return eM($e(), G(), (e & 16) === 16);
}
function eM(e, t, n) {
  if (Sr(e) && !n) {
    let r = on(e.index, t);
    return new xr(r, r);
  } else if (e.type & 175) {
    let r = t[Vt];
    return new xr(r, t);
  }
  return null;
}
function X_(e) {
  let {
    rootComponent: t,
    appProviders: n,
    platformProviders: r,
    platformRef: o,
  } = e;
  ue(8);
  try {
    let i = o?.injector ?? KS(r),
      s = [$_({}), { provide: en, useExisting: Oh }, Iv, ...(n || [])],
      a = new Is({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return qS({
      r3Injector: a.injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    ue(9);
  }
}
function _i(e) {
  return typeof e == "boolean" ? e : e != null && e !== "false";
}
var n0 = null;
function cn() {
  return n0;
}
function jh(e) {
  n0 ??= e;
}
var Us = class {},
  Uh = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({
        token: e,
        factory: () => f(r0),
        providedIn: "platform",
      });
    }
    return e;
  })();
var r0 = (() => {
  class e extends Uh {
    _location;
    _history;
    _doc = f(Oe);
    constructor() {
      super(),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return cn().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = cn().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", n, !1),
        () => r.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let r = cn().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("hashchange", n, !1),
        () => r.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, r, o) {
      this._history.pushState(n, r, o);
    }
    replaceState(n, r, o) {
      this._history.replaceState(n, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({
      token: e,
      factory: () => new e(),
      providedIn: "platform",
    });
  }
  return e;
})();
function o0(e, t) {
  return e
    ? t
      ? e.endsWith("/")
        ? t.startsWith("/")
          ? e + t.slice(1)
          : e + t
        : t.startsWith("/")
        ? e + t
        : `${e}/${t}`
      : e
    : t;
}
function e0(e) {
  let t = e.search(/#|\?|$/);
  return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e;
}
function Or(e) {
  return e && e[0] !== "?" ? `?${e}` : e;
}
var bi = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => f(s0), providedIn: "root" });
    }
    return e;
  })(),
  i0 = new M(""),
  s0 = (() => {
    class e extends bi {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(n, r) {
        super(),
          (this._platformLocation = n),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            f(Oe).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return o0(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + Or(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + Or(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + Or(i));
        this._platformLocation.replaceState(n, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Uh), H(i0, 8));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Pr = (() => {
    class e {
      _subject = new Ae();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(n) {
        this._locationStrategy = n;
        let r = this._locationStrategy.getBaseHref();
        (this._basePath = rM(e0(t0(r)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.next({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, r = "") {
        return this.path() == this.normalize(n + Or(r));
      }
      normalize(n) {
        return e.stripTrailingSlash(nM(this._basePath, t0(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, r = "", o = null) {
        this._locationStrategy.pushState(o, "", n, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Or(r)), o);
      }
      replaceState(n, r = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Or(r)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((r) => {
            this._notifyUrlChangeListeners(r.url, r.state);
          })),
          () => {
            let r = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(r, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", r) {
        this._urlChangeListeners.forEach((o) => o(n, r));
      }
      subscribe(n, r, o) {
        return this._subject.subscribe({
          next: n,
          error: r ?? void 0,
          complete: o ?? void 0,
        });
      }
      static normalizeQueryParams = Or;
      static joinWithSlash = o0;
      static stripTrailingSlash = e0;
      static ɵfac = function (r) {
        return new (r || e)(H(bi));
      };
      static ɵprov = w({ token: e, factory: () => tM(), providedIn: "root" });
    }
    return e;
  })();
function tM() {
  return new Pr(H(bi));
}
function nM(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function t0(e) {
  return e.replace(/\/index.html$/, "");
}
function rM(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
var ht = (function (e) {
    return (
      (e[(e.Format = 0)] = "Format"), (e[(e.Standalone = 1)] = "Standalone"), e
    );
  })(ht || {}),
  pe = (function (e) {
    return (
      (e[(e.Narrow = 0)] = "Narrow"),
      (e[(e.Abbreviated = 1)] = "Abbreviated"),
      (e[(e.Wide = 2)] = "Wide"),
      (e[(e.Short = 3)] = "Short"),
      e
    );
  })(pe || {}),
  Nt = (function (e) {
    return (
      (e[(e.Short = 0)] = "Short"),
      (e[(e.Medium = 1)] = "Medium"),
      (e[(e.Long = 2)] = "Long"),
      (e[(e.Full = 3)] = "Full"),
      e
    );
  })(Nt || {}),
  dr = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
  };
function c0(e) {
  return Ht(e)[Fe.LocaleId];
}
function l0(e, t, n) {
  let r = Ht(e),
    o = [r[Fe.DayPeriodsFormat], r[Fe.DayPeriodsStandalone]],
    i = ln(o, t);
  return ln(i, n);
}
function u0(e, t, n) {
  let r = Ht(e),
    o = [r[Fe.DaysFormat], r[Fe.DaysStandalone]],
    i = ln(o, t);
  return ln(i, n);
}
function d0(e, t, n) {
  let r = Ht(e),
    o = [r[Fe.MonthsFormat], r[Fe.MonthsStandalone]],
    i = ln(o, t);
  return ln(i, n);
}
function f0(e, t) {
  let r = Ht(e)[Fe.Eras];
  return ln(r, t);
}
function Bs(e, t) {
  let n = Ht(e);
  return ln(n[Fe.DateFormat], t);
}
function Hs(e, t) {
  let n = Ht(e);
  return ln(n[Fe.TimeFormat], t);
}
function $s(e, t) {
  let r = Ht(e)[Fe.DateTimeFormat];
  return ln(r, t);
}
function zs(e, t) {
  let n = Ht(e),
    r = n[Fe.NumberSymbols][t];
  if (typeof r > "u") {
    if (t === dr.CurrencyDecimal) return n[Fe.NumberSymbols][dr.Decimal];
    if (t === dr.CurrencyGroup) return n[Fe.NumberSymbols][dr.Group];
  }
  return r;
}
function p0(e) {
  if (!e[Fe.ExtraData]) throw new D(2303, !1);
}
function h0(e) {
  let t = Ht(e);
  return (
    p0(t),
    (t[Fe.ExtraData][2] || []).map((r) =>
      typeof r == "string" ? Bh(r) : [Bh(r[0]), Bh(r[1])]
    )
  );
}
function m0(e, t, n) {
  let r = Ht(e);
  p0(r);
  let o = [r[Fe.ExtraData][0], r[Fe.ExtraData][1]],
    i = ln(o, t) || [];
  return ln(i, n) || [];
}
function ln(e, t) {
  for (let n = t; n > -1; n--) if (typeof e[n] < "u") return e[n];
  throw new D(2304, !1);
}
function Bh(e) {
  let [t, n] = e.split(":");
  return { hours: +t, minutes: +n };
}
var oM =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  Vl = {},
  iM =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
function g0(e, t, n, r) {
  let o = hM(e);
  t = ur(n, t) || t;
  let s = [],
    a;
  for (; t; )
    if (((a = iM.exec(t)), a)) {
      s = s.concat(a.slice(1));
      let u = s.pop();
      if (!u) break;
      t = u;
    } else {
      s.push(t);
      break;
    }
  let c = o.getTimezoneOffset();
  r && ((c = y0(r, c)), (o = pM(o, r)));
  let l = "";
  return (
    s.forEach((u) => {
      let d = dM(u);
      l += d
        ? d(o, n, c)
        : u === "''"
        ? "'"
        : u.replace(/(^'|'$)/g, "").replace(/''/g, "'");
    }),
    l
  );
}
function $l(e, t, n) {
  let r = new Date(0);
  return r.setFullYear(e, t, n), r.setHours(0, 0, 0), r;
}
function ur(e, t) {
  let n = c0(e);
  if (((Vl[n] ??= {}), Vl[n][t])) return Vl[n][t];
  let r = "";
  switch (t) {
    case "shortDate":
      r = Bs(e, Nt.Short);
      break;
    case "mediumDate":
      r = Bs(e, Nt.Medium);
      break;
    case "longDate":
      r = Bs(e, Nt.Long);
      break;
    case "fullDate":
      r = Bs(e, Nt.Full);
      break;
    case "shortTime":
      r = Hs(e, Nt.Short);
      break;
    case "mediumTime":
      r = Hs(e, Nt.Medium);
      break;
    case "longTime":
      r = Hs(e, Nt.Long);
      break;
    case "fullTime":
      r = Hs(e, Nt.Full);
      break;
    case "short":
      let o = ur(e, "shortTime"),
        i = ur(e, "shortDate");
      r = jl($s(e, Nt.Short), [o, i]);
      break;
    case "medium":
      let s = ur(e, "mediumTime"),
        a = ur(e, "mediumDate");
      r = jl($s(e, Nt.Medium), [s, a]);
      break;
    case "long":
      let c = ur(e, "longTime"),
        l = ur(e, "longDate");
      r = jl($s(e, Nt.Long), [c, l]);
      break;
    case "full":
      let u = ur(e, "fullTime"),
        d = ur(e, "fullDate");
      r = jl($s(e, Nt.Full), [u, d]);
      break;
  }
  return r && (Vl[n][t] = r), r;
}
function jl(e, t) {
  return (
    t &&
      (e = e.replace(/\{([^}]+)}/g, function (n, r) {
        return t != null && r in t ? t[r] : n;
      })),
    e
  );
}
function wn(e, t, n = "-", r, o) {
  let i = "";
  (e < 0 || (o && e <= 0)) && (o ? (e = -e + 1) : ((e = -e), (i = n)));
  let s = String(e);
  for (; s.length < t; ) s = "0" + s;
  return r && (s = s.slice(s.length - t)), i + s;
}
function sM(e, t) {
  return wn(e, 3).substring(0, t);
}
function Ue(e, t, n = 0, r = !1, o = !1) {
  return function (i, s) {
    let a = aM(e, i);
    if (((n > 0 || a > -n) && (a += n), e === 3))
      a === 0 && n === -12 && (a = 12);
    else if (e === 6) return sM(a, t);
    let c = zs(s, dr.MinusSign);
    return wn(a, t, c, r, o);
  };
}
function aM(e, t) {
  switch (e) {
    case 0:
      return t.getFullYear();
    case 1:
      return t.getMonth();
    case 2:
      return t.getDate();
    case 3:
      return t.getHours();
    case 4:
      return t.getMinutes();
    case 5:
      return t.getSeconds();
    case 6:
      return t.getMilliseconds();
    case 7:
      return t.getDay();
    default:
      throw new D(2301, !1);
  }
}
function ye(e, t, n = ht.Format, r = !1) {
  return function (o, i) {
    return cM(o, i, e, t, n, r);
  };
}
function cM(e, t, n, r, o, i) {
  switch (n) {
    case 2:
      return d0(t, o, r)[e.getMonth()];
    case 1:
      return u0(t, o, r)[e.getDay()];
    case 0:
      let s = e.getHours(),
        a = e.getMinutes();
      if (i) {
        let l = h0(t),
          u = m0(t, o, r),
          d = l.findIndex((g) => {
            if (Array.isArray(g)) {
              let [p, C] = g,
                N = s >= p.hours && a >= p.minutes,
                T = s < C.hours || (s === C.hours && a < C.minutes);
              if (p.hours < C.hours) {
                if (N && T) return !0;
              } else if (N || T) return !0;
            } else if (g.hours === s && g.minutes === a) return !0;
            return !1;
          });
        if (d !== -1) return u[d];
      }
      return l0(t, o, r)[s < 12 ? 0 : 1];
    case 3:
      return f0(t, r)[e.getFullYear() <= 0 ? 0 : 1];
    default:
      let c = n;
      throw new D(2302, !1);
  }
}
function Ul(e) {
  return function (t, n, r) {
    let o = -1 * r,
      i = zs(n, dr.MinusSign),
      s = o > 0 ? Math.floor(o / 60) : Math.ceil(o / 60);
    switch (e) {
      case 0:
        return (o >= 0 ? "+" : "") + wn(s, 2, i) + wn(Math.abs(o % 60), 2, i);
      case 1:
        return "GMT" + (o >= 0 ? "+" : "") + wn(s, 1, i);
      case 2:
        return (
          "GMT" +
          (o >= 0 ? "+" : "") +
          wn(s, 2, i) +
          ":" +
          wn(Math.abs(o % 60), 2, i)
        );
      case 3:
        return r === 0
          ? "Z"
          : (o >= 0 ? "+" : "") +
              wn(s, 2, i) +
              ":" +
              wn(Math.abs(o % 60), 2, i);
      default:
        throw new D(2302, !1);
    }
  };
}
var lM = 0,
  Hl = 4;
function uM(e) {
  let t = $l(e, lM, 1).getDay();
  return $l(e, 0, 1 + (t <= Hl ? Hl : Hl + 7) - t);
}
function v0(e) {
  let t = e.getDay(),
    n = t === 0 ? -3 : Hl - t;
  return $l(e.getFullYear(), e.getMonth(), e.getDate() + n);
}
function Hh(e, t = !1) {
  return function (n, r) {
    let o;
    if (t) {
      let i = new Date(n.getFullYear(), n.getMonth(), 1).getDay() - 1,
        s = n.getDate();
      o = 1 + Math.floor((s + i) / 7);
    } else {
      let i = v0(n),
        s = uM(i.getFullYear()),
        a = i.getTime() - s.getTime();
      o = 1 + Math.round(a / 6048e5);
    }
    return wn(o, e, zs(r, dr.MinusSign));
  };
}
function Bl(e, t = !1) {
  return function (n, r) {
    let i = v0(n).getFullYear();
    return wn(i, e, zs(r, dr.MinusSign), t);
  };
}
var $h = {};
function dM(e) {
  if ($h[e]) return $h[e];
  let t;
  switch (e) {
    case "G":
    case "GG":
    case "GGG":
      t = ye(3, pe.Abbreviated);
      break;
    case "GGGG":
      t = ye(3, pe.Wide);
      break;
    case "GGGGG":
      t = ye(3, pe.Narrow);
      break;
    case "y":
      t = Ue(0, 1, 0, !1, !0);
      break;
    case "yy":
      t = Ue(0, 2, 0, !0, !0);
      break;
    case "yyy":
      t = Ue(0, 3, 0, !1, !0);
      break;
    case "yyyy":
      t = Ue(0, 4, 0, !1, !0);
      break;
    case "Y":
      t = Bl(1);
      break;
    case "YY":
      t = Bl(2, !0);
      break;
    case "YYY":
      t = Bl(3);
      break;
    case "YYYY":
      t = Bl(4);
      break;
    case "M":
    case "L":
      t = Ue(1, 1, 1);
      break;
    case "MM":
    case "LL":
      t = Ue(1, 2, 1);
      break;
    case "MMM":
      t = ye(2, pe.Abbreviated);
      break;
    case "MMMM":
      t = ye(2, pe.Wide);
      break;
    case "MMMMM":
      t = ye(2, pe.Narrow);
      break;
    case "LLL":
      t = ye(2, pe.Abbreviated, ht.Standalone);
      break;
    case "LLLL":
      t = ye(2, pe.Wide, ht.Standalone);
      break;
    case "LLLLL":
      t = ye(2, pe.Narrow, ht.Standalone);
      break;
    case "w":
      t = Hh(1);
      break;
    case "ww":
      t = Hh(2);
      break;
    case "W":
      t = Hh(1, !0);
      break;
    case "d":
      t = Ue(2, 1);
      break;
    case "dd":
      t = Ue(2, 2);
      break;
    case "c":
    case "cc":
      t = Ue(7, 1);
      break;
    case "ccc":
      t = ye(1, pe.Abbreviated, ht.Standalone);
      break;
    case "cccc":
      t = ye(1, pe.Wide, ht.Standalone);
      break;
    case "ccccc":
      t = ye(1, pe.Narrow, ht.Standalone);
      break;
    case "cccccc":
      t = ye(1, pe.Short, ht.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      t = ye(1, pe.Abbreviated);
      break;
    case "EEEE":
      t = ye(1, pe.Wide);
      break;
    case "EEEEE":
      t = ye(1, pe.Narrow);
      break;
    case "EEEEEE":
      t = ye(1, pe.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      t = ye(0, pe.Abbreviated);
      break;
    case "aaaa":
      t = ye(0, pe.Wide);
      break;
    case "aaaaa":
      t = ye(0, pe.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      t = ye(0, pe.Abbreviated, ht.Standalone, !0);
      break;
    case "bbbb":
      t = ye(0, pe.Wide, ht.Standalone, !0);
      break;
    case "bbbbb":
      t = ye(0, pe.Narrow, ht.Standalone, !0);
      break;
    case "B":
    case "BB":
    case "BBB":
      t = ye(0, pe.Abbreviated, ht.Format, !0);
      break;
    case "BBBB":
      t = ye(0, pe.Wide, ht.Format, !0);
      break;
    case "BBBBB":
      t = ye(0, pe.Narrow, ht.Format, !0);
      break;
    case "h":
      t = Ue(3, 1, -12);
      break;
    case "hh":
      t = Ue(3, 2, -12);
      break;
    case "H":
      t = Ue(3, 1);
      break;
    case "HH":
      t = Ue(3, 2);
      break;
    case "m":
      t = Ue(4, 1);
      break;
    case "mm":
      t = Ue(4, 2);
      break;
    case "s":
      t = Ue(5, 1);
      break;
    case "ss":
      t = Ue(5, 2);
      break;
    case "S":
      t = Ue(6, 1);
      break;
    case "SS":
      t = Ue(6, 2);
      break;
    case "SSS":
      t = Ue(6, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      t = Ul(0);
      break;
    case "ZZZZZ":
      t = Ul(3);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      t = Ul(1);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      t = Ul(2);
      break;
    default:
      return null;
  }
  return ($h[e] = t), t;
}
function y0(e, t) {
  e = e.replace(/:/g, "");
  let n = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
  return isNaN(n) ? t : n;
}
function fM(e, t) {
  return (e = new Date(e.getTime())), e.setMinutes(e.getMinutes() + t), e;
}
function pM(e, t, n) {
  let o = e.getTimezoneOffset(),
    i = y0(t, o);
  return fM(e, -1 * (i - o));
}
function hM(e) {
  if (a0(e)) return e;
  if (typeof e == "number" && !isNaN(e)) return new Date(e);
  if (typeof e == "string") {
    if (((e = e.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e))) {
      let [o, i = 1, s = 1] = e.split("-").map((a) => +a);
      return $l(o, i - 1, s);
    }
    let n = parseFloat(e);
    if (!isNaN(e - n)) return new Date(n);
    let r;
    if ((r = e.match(oM))) return mM(r);
  }
  let t = new Date(e);
  if (!a0(t)) throw new D(2302, !1);
  return t;
}
function mM(e) {
  let t = new Date(0),
    n = 0,
    r = 0,
    o = e[8] ? t.setUTCFullYear : t.setFullYear,
    i = e[8] ? t.setUTCHours : t.setHours;
  e[9] && ((n = Number(e[9] + e[10])), (r = Number(e[9] + e[11]))),
    o.call(t, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
  let s = Number(e[4] || 0) - n,
    a = Number(e[5] || 0) - r,
    c = Number(e[6] || 0),
    l = Math.floor(parseFloat("0." + (e[7] || 0)) * 1e3);
  return i.call(t, s, a, c, l), t;
}
function a0(e) {
  return e instanceof Date && !isNaN(e.valueOf());
}
function gM(e, t) {
  return new D(2100, !1);
}
var vM = "mediumDate",
  _0 = new M(""),
  b0 = new M(""),
  So = (() => {
    class e {
      locale;
      defaultTimezone;
      defaultOptions;
      constructor(n, r, o) {
        (this.locale = n),
          (this.defaultTimezone = r),
          (this.defaultOptions = o);
      }
      transform(n, r, o, i) {
        if (n == null || n === "" || n !== n) return null;
        try {
          let s = r ?? this.defaultOptions?.dateFormat ?? vM,
            a =
              o ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return g0(n, s, i || this.locale, a);
        } catch (s) {
          throw gM(e, s.message);
        }
      }
      static ɵfac = function (r) {
        return new (r || e)(k(Fs, 16), k(_0, 24), k(b0, 24));
      };
      static ɵpipe = Do({ name: "date", type: e, pure: !0 });
    }
    return e;
  })();
function Gs(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Mo = class {};
var C0 = "browser";
var Gl = new M(""),
  Zh = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(n, r) {
        (this._zone = r),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o, i) {
        return this._findPluginFor(r).addEventListener(n, r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new D(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Gl), H(Pe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ws = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  zh = "ng-app-id";
function E0(e) {
  for (let t of e) t.remove();
}
function D0(e, t) {
  let n = t.createElement("style");
  return (n.textContent = e), n;
}
function CM(e, t, n, r) {
  let o = e.head?.querySelectorAll(`style[${zh}="${t}"],link[${zh}="${t}"]`);
  if (o)
    for (let i of o)
      i.removeAttribute(zh),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
              usage: 0,
              elements: [i],
            })
          : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
}
function Wh(e, t) {
  let n = t.createElement("link");
  return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n;
}
var Yh = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          CM(n, r, this.inline, this.external),
          this.hosts.add(n.head);
      }
      addStyles(n, r) {
        for (let o of n) this.addUsage(o, this.inline, D0);
        r?.forEach((o) => this.addUsage(o, this.external, Wh));
      }
      removeStyles(n, r) {
        for (let o of n) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(n, r, o) {
        let i = r.get(n);
        i
          ? i.usage++
          : r.set(n, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, o(n, this.doc))
              ),
            });
      }
      removeUsage(n, r) {
        let o = r.get(n);
        o && (o.usage--, o.usage <= 0 && (E0(o.elements), r.delete(n)));
      }
      ngOnDestroy() {
        for (let [, { elements: n }] of [...this.inline, ...this.external])
          E0(n);
        this.hosts.clear();
      }
      addHost(n) {
        this.hosts.add(n);
        for (let [r, { elements: o }] of this.inline)
          o.push(this.addElement(n, D0(r, this.doc)));
        for (let [r, { elements: o }] of this.external)
          o.push(this.addElement(n, Wh(r, this.doc)));
      }
      removeHost(n) {
        this.hosts.delete(n);
      }
      addElement(n, r) {
        return (
          this.nonce && r.setAttribute("nonce", this.nonce), n.appendChild(r)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Oe), H(vl), H(_l, 8), H(yi));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Gh = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Qh = /%COMP%/g;
var I0 = "%COMP%",
  EM = `_nghost-${I0}`,
  DM = `_ngcontent-${I0}`,
  wM = !0,
  IM = new M("", { providedIn: "root", factory: () => wM });
function SM(e) {
  return DM.replace(Qh, e);
}
function MM(e) {
  return EM.replace(Qh, e);
}
function S0(e, t) {
  return t.map((n) => n.replace(Qh, e));
}
var Kh = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      animationDisabled;
      maxAnimationTimeout;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      registry;
      constructor(n, r, o, i, s, a, c, l = null, u, d, g = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = l),
          (this.animationDisabled = u),
          (this.maxAnimationTimeout = d),
          (this.tracingService = g),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new qs(
            n,
            s,
            c,
            this.platformIsServer,
            this.tracingService,
            (this.registry = Uc()),
            this.maxAnimationTimeout
          ));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof zl
            ? o.applyToHost(n)
            : o instanceof Zs && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer,
            g = this.tracingService;
          switch (r.encapsulation) {
            case sr.Emulated:
              i = new zl(
                c,
                l,
                r,
                this.appId,
                u,
                s,
                a,
                d,
                g,
                this.registry,
                this.animationDisabled,
                this.maxAnimationTimeout
              );
              break;
            case sr.ShadowDom:
              return new qh(
                c,
                l,
                n,
                r,
                s,
                a,
                this.nonce,
                d,
                g,
                this.registry,
                this.maxAnimationTimeout
              );
            default:
              i = new Zs(
                c,
                l,
                r,
                u,
                s,
                a,
                d,
                g,
                this.registry,
                this.animationDisabled,
                this.maxAnimationTimeout
              );
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(n) {
        this.rendererByCompId.delete(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          H(Zh),
          H(Yh),
          H(vl),
          H(IM),
          H(Oe),
          H(yi),
          H(Pe),
          H(_l),
          H(Mh),
          H(Th),
          H(wo, 8)
        );
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  qs = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    registry;
    maxAnimationTimeout;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, o, i, s, a) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.tracingService = i),
        (this.registry = s),
        (this.maxAnimationTimeout = a);
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Gh[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (w0(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (w0(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      let { elements: r } = this.registry;
      if (r) {
        r.animate(n, () => n.remove(), this.maxAnimationTimeout);
        return;
      }
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new D(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Gh[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Gh[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (Ln.DashCase | Ln.Important)
        ? t.style.setProperty(n, r, o & Ln.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & Ln.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r, o) {
      if (
        typeof t == "string" &&
        ((t = cn().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new D(5102, !1);
      let i = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (i = this.tracingService.wrapEventListener(t, n, i)),
        this.eventManager.addEventListener(t, n, i, o)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        t(n) === !1 && n.preventDefault();
      };
    }
  };
function w0(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var qh = class extends qs {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, c, l, u, d) {
      super(t, i, s, c, l, u, d),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let g = o.styles;
      g = S0(o.id, g);
      for (let C of g) {
        let N = document.createElement("style");
        a && N.setAttribute("nonce", a),
          (N.textContent = C),
          this.shadowRoot.appendChild(N);
      }
      let p = o.getExternalStyles?.();
      if (p)
        for (let C of p) {
          let N = Wh(C, i);
          a && N.setAttribute("nonce", a), this.shadowRoot.appendChild(N);
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Zs = class extends qs {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    _animationDisabled;
    constructor(t, n, r, o, i, s, a, c, l, u, d, g) {
      super(t, i, s, a, c, l, d),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this._animationDisabled = u);
      let p = r.styles;
      (this.styles = g ? S0(g, p) : p),
        (this.styleUrls = r.getExternalStyles?.(g));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      if (this.removeStylesOnCompDestroy) {
        if (!this._animationDisabled && this.registry.elements) {
          this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
            }, this.maxAnimationTimeout);
          });
          return;
        }
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
      }
    }
  },
  zl = class extends Zs {
    contentAttr;
    hostAttr;
    constructor(t, n, r, o, i, s, a, c, l, u, d, g) {
      let p = o + "-" + r.id;
      super(t, n, r, i, s, a, c, l, u, d, g, p),
        (this.contentAttr = SM(p)),
        (this.hostAttr = MM(p));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  };
var Wl = class e extends Us {
    supportsDOMEvents = !0;
    static makeCurrent() {
      jh(new e());
    }
    onAndCancel(t, n, r, o) {
      return (
        t.addEventListener(n, r, o),
        () => {
          t.removeEventListener(n, r, o);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
        ? t
        : n === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let n = TM();
      return n == null ? null : xM(n);
    }
    resetBaseElement() {
      Ys = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Gs(document.cookie, t);
    }
  },
  Ys = null;
function TM() {
  return (
    (Ys = Ys || document.head.querySelector("base")),
    Ys ? Ys.getAttribute("href") : null
  );
}
function xM(e) {
  return new URL(e, document.baseURI).pathname;
}
var NM = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  T0 = (() => {
    class e extends Ws {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o, i) {
        return (
          n.addEventListener(r, o, i),
          () => this.removeEventListener(n, r, o, i)
        );
      }
      removeEventListener(n, r, o, i) {
        return n.removeEventListener(r, o, i);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Oe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  M0 = ["alt", "control", "meta", "shift"],
  AM = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  RM = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  x0 = (() => {
    class e extends Ws {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o, i) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => cn().onAndCancel(n, s.domEventName, a, i));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          M0.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (s += l + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = s), c;
      }
      static matchEventFullKeyCode(n, r) {
        let o = AM[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              M0.forEach((s) => {
                if (s !== o) {
                  let a = RM[s];
                  a(n) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Oe));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Jh(e, t, n) {
  let r = b({ rootComponent: e, platformRef: n?.platformRef }, kM(t));
  return X_(r);
}
function kM(e) {
  return {
    appProviders: [...VM, ...(e?.providers ?? [])],
    platformProviders: LM,
  };
}
function OM() {
  Wl.makeCurrent();
}
function PM() {
  return new Lt();
}
function FM() {
  return Kp(document), document;
}
var LM = [
  { provide: yi, useValue: C0 },
  { provide: yl, useValue: OM, multi: !0 },
  { provide: Oe, useFactory: FM },
];
var VM = [
  { provide: as, useValue: "root" },
  { provide: Lt, useFactory: PM },
  { provide: Gl, useClass: T0, multi: !0, deps: [Oe] },
  { provide: Gl, useClass: x0, multi: !0, deps: [Oe] },
  Kh,
  Yh,
  Zh,
  { provide: bo, useExisting: Kh },
  { provide: Mo, useClass: NM },
  [],
];
var Di = class {},
  Qs = class {},
  Fr = class e {
    headers;
    normalizedNames = new Map();
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
      t
        ? typeof t == "string"
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                t
                  .split(
                    `
`
                  )
                  .forEach((n) => {
                    let r = n.indexOf(":");
                    if (r > 0) {
                      let o = n.slice(0, r),
                        i = n.slice(r + 1).trim();
                      this.addHeaderEntry(o, i);
                    }
                  });
            })
          : typeof Headers < "u" && t instanceof Headers
          ? ((this.headers = new Map()),
            t.forEach((n, r) => {
              this.addHeaderEntry(r, n);
            }))
          : (this.lazyInit = () => {
              (this.headers = new Map()),
                Object.entries(t).forEach(([n, r]) => {
                  this.setHeaderEntries(n, r);
                });
            })
        : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: "a" });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: "s" });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: "d" });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n));
        });
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let r = t.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
          o.push(...r), this.headers.set(n, o);
          break;
        case "d":
          let i = t.value;
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let s = this.headers.get(n);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s);
          }
          break;
      }
    }
    addHeaderEntry(t, n) {
      let r = t.toLowerCase();
      this.maybeSetNormalizedName(t, r),
        this.headers.has(r)
          ? this.headers.get(r).push(n)
          : this.headers.set(r, [n]);
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var Zl = class {
  encodeKey(t) {
    return N0(t);
  }
  encodeValue(t) {
    return N0(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function jM(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((o) => {
          let i = o.indexOf("="),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ""]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            c = n.get(s) || [];
          c.push(a), n.set(s, c);
        }),
    n
  );
}
var UM = /%(\d[a-f0-9])/gi,
  BM = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function N0(e) {
  return encodeURIComponent(e).replace(UM, (t, n) => BM[n] ?? t);
}
function ql(e) {
  return `${e}`;
}
var wt = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new Zl()), t.fromString)) {
      if (t.fromObject) throw new D(2805, !1);
      this.map = jM(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(ql) : [ql(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: "a" });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: "a" });
            })
          : n.push({ param: r, value: o, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: "s" });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              n.push(ql(t.value)), this.map.set(t.param, n);
              break;
            case "d":
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(ql(t.value));
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Yl = class {
  map = new Map();
  set(t, n) {
    return this.map.set(t, n), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function HM(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function A0(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function R0(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function k0(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function $M(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var O0 = "Content-Type",
  P0 = "Accept",
  F0 = "X-Request-URL",
  L0 = "text/plain",
  V0 = "application/json",
  zM = `${V0}, ${L0}, */*`,
  Ci = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    referrer;
    integrity;
    responseType = "json";
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(t, n, r, o) {
      (this.url = n), (this.method = t.toUpperCase());
      let i;
      if (
        (HM(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i)
      ) {
        if (
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          (this.keepalive = !!i.keepalive),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          i.priority && (this.priority = i.priority),
          i.cache && (this.cache = i.cache),
          i.credentials && (this.credentials = i.credentials),
          typeof i.timeout == "number")
        ) {
          if (i.timeout < 1 || !Number.isInteger(i.timeout))
            throw new D(2822, "");
          this.timeout = i.timeout;
        }
        i.mode && (this.mode = i.mode),
          i.redirect && (this.redirect = i.redirect),
          i.integrity && (this.integrity = i.integrity),
          i.referrer && (this.referrer = i.referrer),
          (this.transferCache = i.transferCache);
      }
      if (
        ((this.headers ??= new Fr()), (this.context ??= new Yl()), !this.params)
      )
        (this.params = new wt()), (this.urlWithParams = n);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          A0(this.body) ||
          R0(this.body) ||
          k0(this.body) ||
          $M(this.body)
        ? this.body
        : this.body instanceof wt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || k0(this.body)
        ? null
        : R0(this.body)
        ? this.body.type || null
        : A0(this.body)
        ? null
        : typeof this.body == "string"
        ? L0
        : this.body instanceof wt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? V0
        : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.keepalive ?? this.keepalive,
        s = t.priority || this.priority,
        a = t.cache || this.cache,
        c = t.mode || this.mode,
        l = t.redirect || this.redirect,
        u = t.credentials || this.credentials,
        d = t.referrer || this.referrer,
        g = t.integrity || this.integrity,
        p = t.transferCache ?? this.transferCache,
        C = t.timeout ?? this.timeout,
        N = t.body !== void 0 ? t.body : this.body,
        T = t.withCredentials ?? this.withCredentials,
        x = t.reportProgress ?? this.reportProgress,
        Ve = t.headers || this.headers,
        pn = t.params || this.params,
        st = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (Ve = Object.keys(t.setHeaders).reduce(
            (Wr, qr) => Wr.set(qr, t.setHeaders[qr]),
            Ve
          )),
        t.setParams &&
          (pn = Object.keys(t.setParams).reduce(
            (Wr, qr) => Wr.set(qr, t.setParams[qr]),
            pn
          )),
        new e(n, r, N, {
          params: pn,
          headers: Ve,
          context: st,
          reportProgress: x,
          responseType: o,
          withCredentials: T,
          transferCache: p,
          keepalive: i,
          cache: a,
          priority: s,
          timeout: C,
          mode: c,
          redirect: l,
          credentials: u,
          referrer: d,
          integrity: g,
        })
      );
    }
  },
  To = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(To || {}),
  wi = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    redirected;
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new Fr()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.redirected = t.redirected),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Ql = class e extends wi {
    constructor(t = {}) {
      super(t);
    }
    type = To.ResponseHeader;
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Ks = class e extends wi {
    body;
    constructor(t = {}) {
      super(t), (this.body = t.body !== void 0 ? t.body : null);
    }
    type = To.Response;
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
        redirected: t.redirected ?? this.redirected,
      });
    }
  },
  Ei = class extends wi {
    name = "HttpErrorResponse";
    message;
    error;
    ok = !1;
    constructor(t) {
      super(t, 0, "Unknown Error"),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  GM = 200,
  WM = 204;
function Xh(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    credentials: e.credentials,
    transferCache: e.transferCache,
    timeout: e.timeout,
    keepalive: e.keepalive,
    priority: e.priority,
    cache: e.cache,
    mode: e.mode,
    redirect: e.redirect,
    integrity: e.integrity,
    referrer: e.referrer,
  };
}
var At = (() => {
  class e {
    handler;
    constructor(n) {
      this.handler = n;
    }
    request(n, r, o = {}) {
      let i;
      if (n instanceof Ci) i = n;
      else {
        let c;
        o.headers instanceof Fr ? (c = o.headers) : (c = new Fr(o.headers));
        let l;
        o.params &&
          (o.params instanceof wt
            ? (l = o.params)
            : (l = new wt({ fromObject: o.params }))),
          (i = new Ci(n, r, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: l,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
            keepalive: o.keepalive,
            priority: o.priority,
            cache: o.cache,
            mode: o.mode,
            redirect: o.redirect,
            credentials: o.credentials,
            referrer: o.referrer,
            integrity: o.integrity,
            timeout: o.timeout,
          }));
      }
      let s = V(i).pipe(Jn((c) => this.handler.handle(c)));
      if (n instanceof Ci || o.observe === "events") return s;
      let a = s.pipe(We((c) => c instanceof Ks));
      switch (o.observe || "body") {
        case "body":
          switch (i.responseType) {
            case "arraybuffer":
              return a.pipe(
                J((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new D(2806, !1);
                  return c.body;
                })
              );
            case "blob":
              return a.pipe(
                J((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new D(2807, !1);
                  return c.body;
                })
              );
            case "text":
              return a.pipe(
                J((c) => {
                  if (c.body !== null && typeof c.body != "string")
                    throw new D(2808, !1);
                  return c.body;
                })
              );
            case "json":
            default:
              return a.pipe(J((c) => c.body));
          }
        case "response":
          return a;
        default:
          throw new D(2809, !1);
      }
    }
    delete(n, r = {}) {
      return this.request("DELETE", n, r);
    }
    get(n, r = {}) {
      return this.request("GET", n, r);
    }
    head(n, r = {}) {
      return this.request("HEAD", n, r);
    }
    jsonp(n, r) {
      return this.request("JSONP", n, {
        params: new wt().append(r, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, r = {}) {
      return this.request("OPTIONS", n, r);
    }
    patch(n, r, o = {}) {
      return this.request("PATCH", n, Xh(o, r));
    }
    post(n, r, o = {}) {
      return this.request("POST", n, Xh(o, r));
    }
    put(n, r, o = {}) {
      return this.request("PUT", n, Xh(o, r));
    }
    static ɵfac = function (r) {
      return new (r || e)(H(Di));
    };
    static ɵprov = w({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var qM = new M("");
function ZM(e, t) {
  return t(e);
}
function YM(e, t, n) {
  return (r, o) => qe(n, () => t(r, (i) => e(i, o)));
}
var tm = new M(""),
  j0 = new M(""),
  U0 = new M("", { providedIn: "root", factory: () => !0 });
var Kl = (() => {
  class e extends Di {
    backend;
    injector;
    chain = null;
    pendingTasks = f(vs);
    contributeToStability = f(U0);
    constructor(n, r) {
      super(), (this.backend = n), (this.injector = r);
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(
          new Set([...this.injector.get(tm), ...this.injector.get(j0, [])])
        );
        this.chain = r.reduceRight((o, i) => YM(o, i, this.injector), ZM);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(Tn(r));
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(H(Qs), H(je));
    };
    static ɵprov = w({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var QM = /^\)\]\}',?\n/,
  KM = RegExp(`^${F0}:`, "m");
function JM(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : KM.test(e.getAllResponseHeaders())
    ? e.getResponseHeader(F0)
    : null;
}
var em = (() => {
    class e {
      xhrFactory;
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new D(-2800, !1);
        let r = this.xhrFactory;
        return V(null).pipe(
          ut(
            () =>
              new te((i) => {
                let s = r.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((T, x) =>
                    s.setRequestHeader(T, x.join(","))
                  ),
                  n.headers.has(P0) || s.setRequestHeader(P0, zM),
                  !n.headers.has(O0))
                ) {
                  let T = n.detectContentTypeHeader();
                  T !== null && s.setRequestHeader(O0, T);
                }
                if ((n.timeout && (s.timeout = n.timeout), n.responseType)) {
                  let T = n.responseType.toLowerCase();
                  s.responseType = T !== "json" ? T : "text";
                }
                let a = n.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c;
                    let T = s.statusText || "OK",
                      x = new Fr(s.getAllResponseHeaders()),
                      Ve = JM(s) || n.url;
                    return (
                      (c = new Ql({
                        headers: x,
                        status: s.status,
                        statusText: T,
                        url: Ve,
                      })),
                      c
                    );
                  },
                  u = () => {
                    let {
                        headers: T,
                        status: x,
                        statusText: Ve,
                        url: pn,
                      } = l(),
                      st = null;
                    x !== WM &&
                      (st =
                        typeof s.response > "u" ? s.responseText : s.response),
                      x === 0 && (x = st ? GM : 0);
                    let Wr = x >= 200 && x < 300;
                    if (n.responseType === "json" && typeof st == "string") {
                      let qr = st;
                      st = st.replace(QM, "");
                      try {
                        st = st !== "" ? JSON.parse(st) : null;
                      } catch (MC) {
                        (st = qr),
                          Wr && ((Wr = !1), (st = { error: MC, text: st }));
                      }
                    }
                    Wr
                      ? (i.next(
                          new Ks({
                            body: st,
                            headers: T,
                            status: x,
                            statusText: Ve,
                            url: pn || void 0,
                          })
                        ),
                        i.complete())
                      : i.error(
                          new Ei({
                            error: st,
                            headers: T,
                            status: x,
                            statusText: Ve,
                            url: pn || void 0,
                          })
                        );
                  },
                  d = (T) => {
                    let { url: x } = l(),
                      Ve = new Ei({
                        error: T,
                        status: s.status || 0,
                        statusText: s.statusText || "Unknown Error",
                        url: x || void 0,
                      });
                    i.error(Ve);
                  },
                  g = d;
                n.timeout &&
                  (g = (T) => {
                    let { url: x } = l(),
                      Ve = new Ei({
                        error: new DOMException(
                          "Request timed out",
                          "TimeoutError"
                        ),
                        status: s.status || 0,
                        statusText: s.statusText || "Request timeout",
                        url: x || void 0,
                      });
                    i.error(Ve);
                  });
                let p = !1,
                  C = (T) => {
                    p || (i.next(l()), (p = !0));
                    let x = { type: To.DownloadProgress, loaded: T.loaded };
                    T.lengthComputable && (x.total = T.total),
                      n.responseType === "text" &&
                        s.responseText &&
                        (x.partialText = s.responseText),
                      i.next(x);
                  },
                  N = (T) => {
                    let x = { type: To.UploadProgress, loaded: T.loaded };
                    T.lengthComputable && (x.total = T.total), i.next(x);
                  };
                return (
                  s.addEventListener("load", u),
                  s.addEventListener("error", d),
                  s.addEventListener("timeout", g),
                  s.addEventListener("abort", d),
                  n.reportProgress &&
                    (s.addEventListener("progress", C),
                    a !== null &&
                      s.upload &&
                      s.upload.addEventListener("progress", N)),
                  s.send(a),
                  i.next({ type: To.Sent }),
                  () => {
                    s.removeEventListener("error", d),
                      s.removeEventListener("abort", d),
                      s.removeEventListener("load", u),
                      s.removeEventListener("timeout", g),
                      n.reportProgress &&
                        (s.removeEventListener("progress", C),
                        a !== null &&
                          s.upload &&
                          s.upload.removeEventListener("progress", N)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              })
          )
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Mo));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  B0 = new M(""),
  XM = "XSRF-TOKEN",
  eT = new M("", { providedIn: "root", factory: () => XM }),
  tT = "X-XSRF-TOKEN",
  nT = new M("", { providedIn: "root", factory: () => tT }),
  Js = class {},
  rT = (() => {
    class e {
      doc;
      cookieName;
      lastCookieString = "";
      lastToken = null;
      parseCount = 0;
      constructor(n, r) {
        (this.doc = n), (this.cookieName = r);
      }
      getToken() {
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = Gs(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Oe), H(eT));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function oT(e, t) {
  let n = e.url.toLowerCase();
  if (
    !f(B0) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return t(e);
  let r = f(Js).getToken(),
    o = f(nT);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
var nm = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = "Interceptors"),
    (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
    (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (e[(e.Fetch = 6)] = "Fetch"),
    e
  );
})(nm || {});
function iT(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function rm(...e) {
  let t = [
    At,
    em,
    Kl,
    { provide: Di, useExisting: Kl },
    { provide: Qs, useFactory: () => f(qM, { optional: !0 }) ?? f(em) },
    { provide: tm, useValue: oT, multi: !0 },
    { provide: B0, useValue: !0 },
    { provide: Js, useClass: rT },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return xn(t);
}
function om(e) {
  return iT(
    nm.Interceptors,
    e.map((t) => ({ provide: tm, useValue: t, multi: !0 }))
  );
}
var H0 = (() => {
  class e {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
    static ɵfac = function (r) {
      return new (r || e)(H(Oe));
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var ee = "primary",
  pa = Symbol("RouteTitle"),
  lm = class {
    params;
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Ao(e) {
  return new lm(e);
}
function Q0(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ":") o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function aT(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Hn(e[n], t[n])) return !1;
  return !0;
}
function Hn(e, t) {
  let n = e ? um(e) : void 0,
    r = t ? um(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !K0(e[o], t[o]))) return !1;
  return !0;
}
function um(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function K0(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function J0(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function pr(e) {
  return Zd(e) ? e : Ar(e) ? we(Promise.resolve(e)) : V(e);
}
var cT = { exact: eb, subset: tb },
  X0 = { exact: lT, subset: uT, ignored: () => !0 };
function $0(e, t, n) {
  return (
    cT[n.paths](e.root, t.root, n.matrixParams) &&
    X0[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function lT(e, t) {
  return Hn(e, t);
}
function eb(e, t, n) {
  if (
    !xo(e.segments, t.segments) ||
    !eu(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !eb(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function uT(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => K0(e[n], t[n]))
  );
}
function tb(e, t, n) {
  return nb(e, t, t.segments, n);
}
function nb(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!xo(o, n) || t.hasChildren() || !eu(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!xo(e.segments, n) || !eu(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !tb(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !xo(e.segments, o) || !eu(e.segments, o, r) || !e.children[ee]
      ? !1
      : nb(e.children[ee], t, i, r);
  }
}
function eu(e, t, n) {
  return t.every((r, o) => X0[n](e[o].parameters, r.parameters));
}
var zn = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(t = new se([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Ao(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return pT.serialize(this);
    }
  },
  se = class {
    segments;
    children;
    parent = null;
    constructor(t, n) {
      (this.segments = t),
        (this.children = n),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return tu(this);
    }
  },
  Lr = class {
    path;
    parameters;
    _parameterMap;
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= Ao(this.parameters)), this._parameterMap;
    }
    toString() {
      return ob(this);
    }
  };
function dT(e, t) {
  return xo(e, t) && e.every((n, r) => Hn(n.parameters, t[r].parameters));
}
function xo(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function fT(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === ee && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== ee && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var ha = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({
        token: e,
        factory: () => new Ro(),
        providedIn: "root",
      });
    }
    return e;
  })(),
  Ro = class {
    parse(t) {
      let n = new fm(t);
      return new zn(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(t) {
      let n = `/${Xs(t.root, !0)}`,
        r = gT(t.queryParams),
        o = typeof t.fragment == "string" ? `#${hT(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  pT = new Ro();
function tu(e) {
  return e.segments.map((t) => ob(t)).join("/");
}
function Xs(e, t) {
  if (!e.hasChildren()) return tu(e);
  if (t) {
    let n = e.children[ee] ? Xs(e.children[ee], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== ee && r.push(`${o}:${Xs(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = fT(e, (r, o) =>
      o === ee ? [Xs(e.children[ee], !1)] : [`${o}:${Xs(r, !1)}`]
    );
    return Object.keys(e.children).length === 1 && e.children[ee] != null
      ? `${tu(e)}/${n[0]}`
      : `${tu(e)}/(${n.join("//")})`;
  }
}
function rb(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Jl(e) {
  return rb(e).replace(/%3B/gi, ";");
}
function hT(e) {
  return encodeURI(e);
}
function dm(e) {
  return rb(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function nu(e) {
  return decodeURIComponent(e);
}
function z0(e) {
  return nu(e.replace(/\+/g, "%20"));
}
function ob(e) {
  return `${dm(e.path)}${mT(e.parameters)}`;
}
function mT(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${dm(t)}=${dm(n)}`)
    .join("");
}
function gT(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${Jl(n)}=${Jl(o)}`).join("&")
        : `${Jl(n)}=${Jl(r)}`
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var vT = /^[^\/()?;#]+/;
function im(e) {
  let t = e.match(vT);
  return t ? t[0] : "";
}
var yT = /^[^\/()?;=#]+/;
function _T(e) {
  let t = e.match(yT);
  return t ? t[0] : "";
}
var bT = /^[^=?&#]+/;
function CT(e) {
  let t = e.match(bT);
  return t ? t[0] : "";
}
var ET = /^[^&#]+/;
function DT(e) {
  let t = e.match(ET);
  return t ? t[0] : "";
}
var fm = class {
  url;
  remaining;
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new se([], {})
        : new se([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[ee] = new se(t, n)),
      r
    );
  }
  parseSegment() {
    let t = im(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new D(4009, !1);
    return this.capture(t), new Lr(nu(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = _T(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = im(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[nu(n)] = nu(r);
  }
  parseQueryParam(t) {
    let n = CT(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = DT(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = z0(n),
      i = z0(r);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
    } else t[o] = i;
  }
  parseParens(t) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = im(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new D(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = ee);
      let s = this.parseChildren();
      (n[i] = Object.keys(s).length === 1 ? s[ee] : new se([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new D(4011, !1);
  }
};
function ib(e) {
  return e.segments.length > 0 ? new se([], { [ee]: e }) : e;
}
function sb(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = sb(o);
    if (r === ee && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new se(e.segments, t);
  return wT(n);
}
function wT(e) {
  if (e.numberOfChildren === 1 && e.children[ee]) {
    let t = e.children[ee];
    return new se(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function Vr(e) {
  return e instanceof zn;
}
function ab(e, t, n = null, r = null) {
  let o = cb(e);
  return lb(o, t, n, r);
}
function cb(e) {
  let t;
  function n(i) {
    let s = {};
    for (let c of i.children) {
      let l = n(c);
      s[c.outlet] = l;
    }
    let a = new se(i.url, s);
    return i === e && (t = a), a;
  }
  let r = n(e.root),
    o = ib(r);
  return t ?? o;
}
function lb(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return sm(o, o, o, n, r);
  let i = IT(t);
  if (i.toRoot()) return sm(o, o, new se([], {}), n, r);
  let s = ST(i, o, e),
    a = s.processChildren
      ? ta(s.segmentGroup, s.index, i.commands)
      : db(s.segmentGroup, s.index, i.commands);
  return sm(o, s.segmentGroup, a, n, r);
}
function ru(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function oa(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function sm(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      i[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  e === t ? (s = n) : (s = ub(e, t, n));
  let a = ib(sb(s));
  return new zn(a, i, o);
}
function ub(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = ub(i, t, n));
    }),
    new se(e.segments, r)
  );
}
var ou = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && ru(r[0]))
    )
      throw new D(4003, !1);
    let o = r.find(oa);
    if (o && o !== J0(r)) throw new D(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function IT(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new ou(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
        ? (i.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (n = !0)
                : a === ".."
                ? t++
                : a != "" && o.push(a));
          }),
          o)
        : [...o, i];
    }, []);
  return new ou(n, t, r);
}
var Mi = class {
  segmentGroup;
  processChildren;
  index;
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function ST(e, t, n) {
  if (e.isAbsolute) return new Mi(t, !0, 0);
  if (!n) return new Mi(t, !1, NaN);
  if (n.parent === null) return new Mi(n, !0, 0);
  let r = ru(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return MT(n, o, e.numberOfDoubleDots);
}
function MT(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
    o = r.segments.length;
  }
  return new Mi(r, !1, o - i);
}
function TT(e) {
  return oa(e[0]) ? e[0].outlets : { [ee]: e };
}
function db(e, t, n) {
  if (((e ??= new se([], {})), e.segments.length === 0 && e.hasChildren()))
    return ta(e, t, n);
  let r = xT(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new se(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[ee] = new se(e.segments.slice(r.pathIndex), e.children)),
      ta(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new se(e.segments, {})
      : r.match && !e.hasChildren()
      ? pm(e, t, n)
      : r.match
      ? ta(e, 0, o)
      : pm(e, t, n);
}
function ta(e, t, n) {
  if (n.length === 0) return new se(e.segments, {});
  {
    let r = TT(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== ee) &&
      e.children[ee] &&
      e.numberOfChildren === 1 &&
      e.children[ee].segments.length === 0
    ) {
      let i = ta(e.children[ee], t, n);
      return new se(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = db(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new se(e.segments, o)
    );
  }
}
function xT(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (oa(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!W0(c, l, s)) return i;
      r += 2;
    } else {
      if (!W0(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function pm(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (oa(i)) {
      let c = NT(i.outlets);
      return new se(r, c);
    }
    if (o === 0 && ru(n[0])) {
      let c = e.segments[t];
      r.push(new Lr(c.path, G0(n[0]))), o++;
      continue;
    }
    let s = oa(i) ? i.outlets[ee] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && ru(a)
      ? (r.push(new Lr(s, G0(a))), (o += 2))
      : (r.push(new Lr(s, {})), o++);
  }
  return new se(r, {});
}
function NT(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = pm(new se([], {}), 0, r));
    }),
    t
  );
}
function G0(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function W0(e, t, n) {
  return e == n.path && Hn(t, n.parameters);
}
var na = "imperative",
  Ke = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(Ke || {}),
  Zt = class {
    id;
    url;
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  ko = class extends Zt {
    type = Ke.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(t, n, r = "imperative", o = null) {
      super(t, n), (this.navigationTrigger = r), (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Yt = class extends Zt {
    urlAfterRedirects;
    type = Ke.NavigationEnd;
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  It = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      (e[(e.Aborted = 4)] = "Aborted"),
      e
    );
  })(It || {}),
  ia = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(ia || {}),
  $n = class extends Zt {
    reason;
    code;
    type = Ke.NavigationCancel;
    constructor(t, n, r, o) {
      super(t, n), (this.reason = r), (this.code = o);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  fr = class extends Zt {
    reason;
    code;
    type = Ke.NavigationSkipped;
    constructor(t, n, r, o) {
      super(t, n), (this.reason = r), (this.code = o);
    }
  },
  xi = class extends Zt {
    error;
    target;
    type = Ke.NavigationError;
    constructor(t, n, r, o) {
      super(t, n), (this.error = r), (this.target = o);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  sa = class extends Zt {
    urlAfterRedirects;
    state;
    type = Ke.RoutesRecognized;
    constructor(t, n, r, o) {
      super(t, n), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  iu = class extends Zt {
    urlAfterRedirects;
    state;
    type = Ke.GuardsCheckStart;
    constructor(t, n, r, o) {
      super(t, n), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  su = class extends Zt {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = Ke.GuardsCheckEnd;
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  au = class extends Zt {
    urlAfterRedirects;
    state;
    type = Ke.ResolveStart;
    constructor(t, n, r, o) {
      super(t, n), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  cu = class extends Zt {
    urlAfterRedirects;
    state;
    type = Ke.ResolveEnd;
    constructor(t, n, r, o) {
      super(t, n), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  lu = class {
    route;
    type = Ke.RouteConfigLoadStart;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  uu = class {
    route;
    type = Ke.RouteConfigLoadEnd;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  du = class {
    snapshot;
    type = Ke.ChildActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  fu = class {
    snapshot;
    type = Ke.ChildActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  pu = class {
    snapshot;
    type = Ke.ActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  hu = class {
    snapshot;
    type = Ke.ActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var aa = class {},
  Ni = class {
    url;
    navigationBehaviorOptions;
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function AT(e) {
  return !(e instanceof aa) && !(e instanceof Ni);
}
function RT(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = Rs(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function In(e) {
  return e.outlet || ee;
}
function kT(e, t) {
  let n = e.filter((r) => In(r) === t);
  return n.push(...e.filter((r) => In(r) !== t)), n;
}
function ki(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var mu = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return ki(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(t) {
      (this.rootInjector = t), (this.children = new Oi(this.rootInjector));
    }
  },
  Oi = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(n) {
        this.rootInjector = n;
      }
      onChildOutletCreated(n, r) {
        let o = this.getOrCreateContext(n);
        (o.outlet = r), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let r = this.getContext(n);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let r = this.getContext(n);
        return (
          r || ((r = new mu(this.rootInjector)), this.contexts.set(n, r)), r
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(H(je));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  gu = class {
    _root;
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let n = this.pathFromRoot(t);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(t) {
      let n = hm(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = hm(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = mm(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return mm(t, this._root).map((n) => n.value);
    }
  };
function hm(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = hm(e, n);
    if (r) return r;
  }
  return null;
}
function mm(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = mm(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var qt = class {
  value;
  children;
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Si(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var ca = class extends gu {
  snapshot;
  constructor(t, n) {
    super(t), (this.snapshot = n), Dm(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function fb(e) {
  let t = OT(e),
    n = new et([new Lr("", {})]),
    r = new et({}),
    o = new et({}),
    i = new et({}),
    s = new et(""),
    a = new St(n, r, i, s, o, ee, e, t.root);
  return (a.snapshot = t.root), new ca(new qt(a, []), t);
}
function OT(e) {
  let t = {},
    n = {},
    r = {},
    i = new No([], t, r, "", n, ee, e, null, {});
  return new la("", new qt(i, []));
}
var St = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(t, n, r, o, i, s, a, c) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(J((l) => l[pa])) ?? V(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(J((t) => Ao(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(J((t) => Ao(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function vu(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: b(b({}, t.params), e.params),
          data: b(b({}, t.data), e.data),
          resolve: b(b(b(b({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: b({}, e.params),
          data: b({}, e.data),
          resolve: b(b({}, e.data), e._resolvedData ?? {}),
        }),
    o && hb(o) && (r.resolve[pa] = o.title),
    r
  );
}
var No = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    get title() {
      return this.data?.[pa];
    }
    constructor(t, n, r, o, i, s, a, c, l) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Ao(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Ao(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  la = class extends gu {
    url;
    constructor(t, n) {
      super(n), (this.url = t), Dm(this, n);
    }
    toString() {
      return pb(this._root);
    }
  };
function Dm(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => Dm(e, n));
}
function pb(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(pb).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function am(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      Hn(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Hn(t.params, n.params) || e.paramsSubject.next(n.params),
      aT(t.url, n.url) || e.urlSubject.next(n.url),
      Hn(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function gm(e, t) {
  let n = Hn(e.params, t.params) && dT(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || gm(e.parent, t.parent));
}
function hb(e) {
  return typeof e.title == "string" || e.title === null;
}
var mb = new M(""),
  Oo = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = ee;
      activateEvents = new De();
      deactivateEvents = new De();
      attachEvents = new De();
      detachEvents = new De();
      routerOutletData = Le(void 0);
      parentContexts = f(Oi);
      location = f(ar);
      changeDetector = f(kr);
      inputBinder = f(Cu, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: o } = n.name;
          if (r) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new D(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new D(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new D(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, r) {
        (this.activated = n),
          (this._activatedRoute = r),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, r) {
        if (this.isActivated) throw new D(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          s = n.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new vm(n, a, o.injector, this.routerOutletData);
        (this.activated = o.createComponent(s, {
          index: o.length,
          injector: c,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = de({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name", routerOutletData: [1, "routerOutletData"] },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        features: [Bt],
      });
    }
    return e;
  })(),
  vm = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(t, n, r, o) {
      (this.route = t),
        (this.childContexts = n),
        (this.parent = r),
        (this.outletData = o);
    }
    get(t, n) {
      return t === St
        ? this.route
        : t === Oi
        ? this.childContexts
        : t === mb
        ? this.outletData
        : this.parent.get(t, n);
    }
  },
  Cu = new M("");
var wm = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = L({
      type: e,
      selectors: [["ng-component"]],
      exportAs: ["emptyRouterOutlet"],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && U(0, "router-outlet");
      },
      dependencies: [Oo],
      encapsulation: 2,
    });
  }
  return e;
})();
function Im(e) {
  let t = e.children && e.children.map(Im),
    n = t ? B(b({}, e), { children: t }) : b({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== ee &&
      (n.component = wm),
    n
  );
}
function PT(e, t, n) {
  let r = ua(e, t._root, n ? n._root : void 0);
  return new ca(r, t);
}
function ua(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = FT(e, t, n);
    return new qt(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => ua(e, a))),
          s
        );
      }
    }
    let r = LT(t.value),
      o = t.children.map((i) => ua(e, i));
    return new qt(r, o);
  }
}
function FT(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return ua(e, r, o);
    return ua(e, r);
  });
}
function LT(e) {
  return new St(
    new et(e.url),
    new et(e.params),
    new et(e.queryParams),
    new et(e.fragment),
    new et(e.data),
    e.outlet,
    e.component,
    e
  );
}
var Ai = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  gb = "ngNavigationCancelingError";
function yu(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = Vr(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = vb(!1, It.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function vb(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[gb] = !0), (n.cancellationCode = t), n;
}
function VT(e) {
  return yb(e) && Vr(e.url);
}
function yb(e) {
  return !!e && e[gb];
}
var jT = (e, t, n, r) =>
    J(
      (o) => (
        new ym(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      )
    ),
  ym = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(t, n, r, o, i) {
      (this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, t),
        am(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let o = Si(n);
      t.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], r), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        });
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, n, s.children);
        } else this.deactivateChildRoutes(t, n, r);
      else i && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Si(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Si(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = Si(n);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new hu(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new fu(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((am(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            am(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  _u = class {
    path;
    route;
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  Ti = class {
    component;
    route;
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function UT(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return ea(r, o, n, [r.value]);
}
function BT(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Pi(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !gf(e) ? e : t.get(e)) : r;
}
function ea(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = Si(t);
  return (
    e.children.forEach((s) => {
      HT(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => ra(a, n.getContext(s), o)),
    o
  );
}
function HT(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = $T(s, i, i.routeConfig.runGuardsAndResolvers);
    c
      ? o.canActivateChecks.push(new _u(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? ea(e, t, a ? a.children : null, r, o) : ea(e, t, n, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Ti(a.outlet.component, s));
  } else
    s && ra(t, a, o),
      o.canActivateChecks.push(new _u(r)),
      i.component
        ? ea(e, null, a ? a.children : null, r, o)
        : ea(e, null, n, r, o);
  return o;
}
function $T(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !xo(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !xo(e.url, t.url) || !Hn(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !gm(e, t) || !Hn(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !gm(e, t);
  }
}
function ra(e, t, n) {
  let r = Si(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? ra(s, t.children.getContext(i), n)
        : ra(s, null, n)
      : ra(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new Ti(t.outlet.component, o))
        : n.canDeactivateChecks.push(new Ti(null, o))
      : n.canDeactivateChecks.push(new Ti(null, o));
}
function ma(e) {
  return typeof e == "function";
}
function zT(e) {
  return typeof e == "boolean";
}
function GT(e) {
  return e && ma(e.canLoad);
}
function WT(e) {
  return e && ma(e.canActivate);
}
function qT(e) {
  return e && ma(e.canActivateChild);
}
function ZT(e) {
  return e && ma(e.canDeactivate);
}
function YT(e) {
  return e && ma(e.canMatch);
}
function _b(e) {
  return e instanceof mn || e?.name === "EmptyError";
}
var Xl = Symbol("INITIAL_VALUE");
function Ri() {
  return ut((e) =>
    gc(e.map((t) => t.pipe(Xt(1), tf(Xl)))).pipe(
      J((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === Xl) return Xl;
            if (n === !1 || QT(n)) return n;
          }
        return !0;
      }),
      We((t) => t !== Xl),
      Xt(1)
    )
  );
}
function QT(e) {
  return Vr(e) || e instanceof Ai;
}
function KT(e, t) {
  return Me((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? V(B(b({}, n), { guardsResult: !0 }))
      : JT(s, r, o, e).pipe(
          Me((a) => (a && zT(a) ? XT(r, i, e, t) : V(a))),
          J((a) => B(b({}, n), { guardsResult: a }))
        );
  });
}
function JT(e, t, n, r) {
  return we(e).pipe(
    Me((o) => ox(o.component, o.route, n, t, r)),
    Xn((o) => o !== !0, !0)
  );
}
function XT(e, t, n, r) {
  return we(t).pipe(
    Jn((o) =>
      vr(
        tx(o.route.parent, r),
        ex(o.route, r),
        rx(e, o.path, n),
        nx(e, o.route, n)
      )
    ),
    Xn((o) => o !== !0, !0)
  );
}
function ex(e, t) {
  return e !== null && t && t(new pu(e)), V(!0);
}
function tx(e, t) {
  return e !== null && t && t(new du(e)), V(!0);
}
function nx(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return V(!0);
  let o = r.map((i) =>
    Xi(() => {
      let s = ki(t) ?? n,
        a = Pi(i, s),
        c = WT(a) ? a.canActivate(t, e) : qe(s, () => a(t, e));
      return pr(c).pipe(Xn());
    })
  );
  return V(o).pipe(Ri());
}
function rx(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => BT(s))
      .filter((s) => s !== null)
      .map((s) =>
        Xi(() => {
          let a = s.guards.map((c) => {
            let l = ki(s.node) ?? n,
              u = Pi(c, l),
              d = qT(u) ? u.canActivateChild(r, e) : qe(l, () => u(r, e));
            return pr(d).pipe(Xn());
          });
          return V(a).pipe(Ri());
        })
      );
  return V(i).pipe(Ri());
}
function ox(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return V(!0);
  let s = i.map((a) => {
    let c = ki(t) ?? o,
      l = Pi(a, c),
      u = ZT(l) ? l.canDeactivate(e, t, n, r) : qe(c, () => l(e, t, n, r));
    return pr(u).pipe(Xn());
  });
  return V(s).pipe(Ri());
}
function ix(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return V(!0);
  let i = o.map((s) => {
    let a = Pi(s, e),
      c = GT(a) ? a.canLoad(t, n) : qe(e, () => a(t, n));
    return pr(c);
  });
  return V(i).pipe(Ri(), bb(r));
}
function bb(e) {
  return Hd(
    le((t) => {
      if (typeof t != "boolean") throw yu(e, t);
    }),
    J((t) => t === !0)
  );
}
function sx(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return V(!0);
  let i = o.map((s) => {
    let a = Pi(s, e),
      c = YT(a) ? a.canMatch(t, n) : qe(e, () => a(t, n));
    return pr(c);
  });
  return V(i).pipe(Ri(), bb(r));
}
var da = class {
    segmentGroup;
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  fa = class extends Error {
    urlTree;
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Ii(e) {
  return Xo(new da(e));
}
function ax(e) {
  return Xo(new D(4e3, !1));
}
function cx(e) {
  return Xo(vb(!1, It.GuardRejected));
}
var _m = class {
  urlSerializer;
  urlTree;
  constructor(t, n) {
    (this.urlSerializer = t), (this.urlTree = n);
  }
  lineralizeSegments(t, n) {
    let r = [],
      o = n.root;
    for (;;) {
      if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return V(r);
      if (o.numberOfChildren > 1 || !o.children[ee])
        return ax(`${t.redirectTo}`);
      o = o.children[ee];
    }
  }
  applyRedirectCommands(t, n, r, o, i) {
    return lx(n, o, i).pipe(
      J((s) => {
        if (s instanceof zn) throw new fa(s);
        let a = this.applyRedirectCreateUrlTree(
          s,
          this.urlSerializer.parse(s),
          t,
          r
        );
        if (s[0] === "/") throw new fa(a);
        return a;
      })
    );
  }
  applyRedirectCreateUrlTree(t, n, r, o) {
    let i = this.createSegmentGroup(t, n.root, r, o);
    return new zn(
      i,
      this.createQueryParams(n.queryParams, this.urlTree.queryParams),
      n.fragment
    );
  }
  createQueryParams(t, n) {
    let r = {};
    return (
      Object.entries(t).forEach(([o, i]) => {
        if (typeof i == "string" && i[0] === ":") {
          let a = i.substring(1);
          r[o] = n[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(t, n, r, o) {
    let i = this.createSegments(t, n.segments, r, o),
      s = {};
    return (
      Object.entries(n.children).forEach(([a, c]) => {
        s[a] = this.createSegmentGroup(t, c, r, o);
      }),
      new se(i, s)
    );
  }
  createSegments(t, n, r, o) {
    return n.map((i) =>
      i.path[0] === ":" ? this.findPosParam(t, i, o) : this.findOrReturn(i, r)
    );
  }
  findPosParam(t, n, r) {
    let o = r[n.path.substring(1)];
    if (!o) throw new D(4001, !1);
    return o;
  }
  findOrReturn(t, n) {
    let r = 0;
    for (let o of n) {
      if (o.path === t.path) return n.splice(r), o;
      r++;
    }
    return t;
  }
};
function lx(e, t, n) {
  if (typeof e == "string") return V(e);
  let r = e,
    {
      queryParams: o,
      fragment: i,
      routeConfig: s,
      url: a,
      outlet: c,
      params: l,
      data: u,
      title: d,
    } = t;
  return pr(
    qe(n, () =>
      r({
        params: l,
        data: u,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d,
      })
    )
  );
}
var bm = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function ux(e, t, n, r, o) {
  let i = Cb(e, t, n);
  return i.matched
    ? ((r = RT(t, r)),
      sx(r, t, n, o).pipe(J((s) => (s === !0 ? i : b({}, bm)))))
    : V(i);
}
function Cb(e, t, n) {
  if (t.path === "**") return dx(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? b({}, bm)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || Q0)(n, e, t);
  if (!o) return b({}, bm);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? b(b({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function dx(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? J0(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function q0(e, t, n, r) {
  return n.length > 0 && hx(e, n, r)
    ? {
        segmentGroup: new se(t, px(r, new se(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && mx(e, n, r)
    ? {
        segmentGroup: new se(e.segments, fx(e, n, r, e.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new se(e.segments, e.children), slicedSegments: n };
}
function fx(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (Eu(e, t, i) && !r[In(i)]) {
      let s = new se([], {});
      o[In(i)] = s;
    }
  return b(b({}, r), o);
}
function px(e, t) {
  let n = {};
  n[ee] = t;
  for (let r of e)
    if (r.path === "" && In(r) !== ee) {
      let o = new se([], {});
      n[In(r)] = o;
    }
  return n;
}
function hx(e, t, n) {
  return n.some((r) => Eu(e, t, r) && In(r) !== ee);
}
function mx(e, t, n) {
  return n.some((r) => Eu(e, t, r));
}
function Eu(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function gx(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var Cm = class {};
function vx(e, t, n, r, o, i, s = "emptyOnly") {
  return new Em(e, t, n, r, o, s, i).recognize();
}
var yx = 31,
  Em = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(t, n, r, o, i, s, a) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new _m(this.urlSerializer, this.urlTree));
    }
    noMatchError(t) {
      return new D(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = q0(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        J(({ children: n, rootSnapshot: r }) => {
          let o = new qt(r, n),
            i = new la("", o),
            s = ab(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        })
      );
    }
    match(t) {
      let n = new No(
        [],
        Object.freeze({}),
        Object.freeze(b({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        ee,
        this.rootComponentType,
        null,
        {}
      );
      return this.processSegmentGroup(
        this.injector,
        this.config,
        t,
        ee,
        n
      ).pipe(
        J((r) => ({ children: r, rootSnapshot: n })),
        Jt((r) => {
          if (r instanceof fa)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof da ? this.noMatchError(r) : r;
        })
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            J((s) => (s instanceof qt ? [s] : []))
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return we(i).pipe(
        Jn((s) => {
          let a = r.children[s],
            c = kT(n, s);
          return this.processSegmentGroup(t, c, a, s, o);
        }),
        ef((s, a) => (s.push(...a), s)),
        yr(null),
        Xd(),
        Me((s) => {
          if (s === null) return Ii(r);
          let a = Eb(s);
          return _x(a), V(a);
        })
      );
    }
    processSegment(t, n, r, o, i, s, a) {
      return we(n).pipe(
        Jn((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? t,
            n,
            c,
            r,
            o,
            i,
            s,
            a
          ).pipe(
            Jt((l) => {
              if (l instanceof da) return V(null);
              throw l;
            })
          )
        ),
        Xn((c) => !!c),
        Jt((c) => {
          if (_b(c)) return gx(r, o, i) ? V(new Cm()) : Ii(r);
          throw c;
        })
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
      return In(r) !== s && (s === ee || !Eu(o, i, r))
        ? Ii(o)
        : r.redirectTo === void 0
        ? this.matchSegmentAgainstRoute(t, o, r, i, s, c)
        : this.allowRedirects && a
        ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c)
        : Ii(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: g,
      } = Cb(n, o, i);
      if (!c) return Ii(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > yx && (this.allowRedirects = !1));
      let p = new No(
          i,
          l,
          Object.freeze(b({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Z0(o),
          In(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          Y0(o)
        ),
        C = vu(p, a, this.paramsInheritanceStrategy);
      return (
        (p.params = Object.freeze(C.params)),
        (p.data = Object.freeze(C.data)),
        this.applyRedirects
          .applyRedirectCommands(u, o.redirectTo, d, p, t)
          .pipe(
            ut((T) => this.applyRedirects.lineralizeSegments(o, T)),
            Me((T) => this.processSegment(t, r, n, T.concat(g), s, !1, a))
          )
      );
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let a = ux(n, r, o, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        a.pipe(
          ut((c) =>
            c.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  ut(({ routes: l }) => {
                    let u = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: g,
                        remainingSegments: p,
                      } = c,
                      C = new No(
                        g,
                        d,
                        Object.freeze(b({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Z0(r),
                        In(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Y0(r)
                      ),
                      N = vu(C, s, this.paramsInheritanceStrategy);
                    (C.params = Object.freeze(N.params)),
                      (C.data = Object.freeze(N.data));
                    let { segmentGroup: T, slicedSegments: x } = q0(n, g, p, l);
                    if (x.length === 0 && T.hasChildren())
                      return this.processChildren(u, l, T, C).pipe(
                        J((pn) => new qt(C, pn))
                      );
                    if (l.length === 0 && x.length === 0)
                      return V(new qt(C, []));
                    let Ve = In(r) === i;
                    return this.processSegment(
                      u,
                      l,
                      T,
                      x,
                      Ve ? ee : i,
                      !0,
                      C
                    ).pipe(J((pn) => new qt(C, pn instanceof qt ? [pn] : [])));
                  })
                ))
              : Ii(n)
          )
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? V({ routes: n.children, injector: t })
        : n.loadChildren
        ? n._loadedRoutes !== void 0
          ? V({ routes: n._loadedRoutes, injector: n._loadedInjector })
          : ix(t, n, r, this.urlSerializer).pipe(
              Me((o) =>
                o
                  ? this.configLoader.loadChildren(t, n).pipe(
                      le((i) => {
                        (n._loadedRoutes = i.routes),
                          (n._loadedInjector = i.injector);
                      })
                    )
                  : cx(n)
              )
            )
        : V({ routes: [], injector: t });
    }
  };
function _x(e) {
  e.sort((t, n) =>
    t.value.outlet === ee
      ? -1
      : n.value.outlet === ee
      ? 1
      : t.value.outlet.localeCompare(n.value.outlet)
  );
}
function bx(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function Eb(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!bx(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = Eb(r.children);
    t.push(new qt(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function Z0(e) {
  return e.data || {};
}
function Y0(e) {
  return e.resolve || {};
}
function Cx(e, t, n, r, o, i) {
  return Me((s) =>
    vx(e, t, n, r, s.extractedUrl, o, i).pipe(
      J(({ state: a, tree: c }) =>
        B(b({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function Ex(e, t) {
  return Me((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return V(n);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let l of Db(c)) s.add(l);
    let a = 0;
    return we(s).pipe(
      Jn((c) =>
        i.has(c)
          ? Dx(c, r, e, t)
          : ((c.data = vu(c, c.parent, e).resolve), V(void 0))
      ),
      le(() => a++),
      ti(1),
      Me((c) => (a === s.size ? V(n) : lt))
    );
  });
}
function Db(e) {
  let t = e.children.map((n) => Db(n)).flat();
  return [e, ...t];
}
function Dx(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !hb(o) && (i[pa] = o.title),
    Xi(
      () => (
        (e.data = vu(e, e.parent, n).resolve),
        wx(i, e, t, r).pipe(
          J(
            (s) => ((e._resolvedData = s), (e.data = b(b({}, e.data), s)), null)
          )
        )
      )
    )
  );
}
function wx(e, t, n, r) {
  let o = um(e);
  if (o.length === 0) return V({});
  let i = {};
  return we(o).pipe(
    Me((s) =>
      Ix(e[s], t, n, r).pipe(
        Xn(),
        le((a) => {
          if (a instanceof Ai) throw yu(new Ro(), a);
          i[s] = a;
        })
      )
    ),
    ti(1),
    J(() => i),
    Jt((s) => (_b(s) ? lt : Xo(s)))
  );
}
function Ix(e, t, n, r) {
  let o = ki(t) ?? r,
    i = Pi(e, o),
    s = i.resolve ? i.resolve(t, n) : qe(o, () => i(t, n));
  return pr(s);
}
function cm(e) {
  return ut((t) => {
    let n = e(t);
    return n ? we(n).pipe(J(() => t)) : V(t);
  });
}
var Sm = (() => {
    class e {
      buildTitle(n) {
        let r,
          o = n.root;
        for (; o !== void 0; )
          (r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === ee));
        return r;
      }
      getResolvedTitleForRoute(n) {
        return n.data[pa];
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => f(wb), providedIn: "root" });
    }
    return e;
  })(),
  wb = (() => {
    class e extends Sm {
      title;
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(H0));
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Fi = new M("", { providedIn: "root", factory: () => ({}) }),
  ga = new M(""),
  Ib = (() => {
    class e {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = f(kh);
      loadComponent(n, r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return V(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = pr(qe(n, () => r.loadComponent())).pipe(
            J(Mb),
            ut(Tb),
            le((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            Tn(() => {
              this.componentLoaders.delete(r);
            })
          ),
          i = new Ko(o, () => new Ae()).pipe(Qo());
        return this.componentLoaders.set(r, i), i;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return V({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Sb(r, this.compiler, n, this.onLoadEndListener).pipe(
            Tn(() => {
              this.childrenLoaders.delete(r);
            })
          ),
          s = new Ko(i, () => new Ae()).pipe(Qo());
        return this.childrenLoaders.set(r, s), s;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Sb(e, t, n, r) {
  return pr(qe(n, () => e.loadChildren())).pipe(
    J(Mb),
    ut(Tb),
    Me((o) =>
      o instanceof xl || Array.isArray(o) ? V(o) : we(t.compileModuleAsync(o))
    ),
    J((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(n).injector),
            (s = i.get(ga, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Im), injector: i }
      );
    })
  );
}
function Sx(e) {
  return e && typeof e == "object" && "default" in e;
}
function Mb(e) {
  return Sx(e) ? e.default : e;
}
function Tb(e) {
  return V(e);
}
var Du = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => f(Mx), providedIn: "root" });
    }
    return e;
  })(),
  Mx = (() => {
    class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, r) {
        return n;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Mm = new M(""),
  Tm = new M("");
function xb(e, t, n) {
  let r = e.get(Tm),
    o = e.get(Oe);
  if (!o.startViewTransition || r.skipNextTransition)
    return (r.skipNextTransition = !1), new Promise((l) => setTimeout(l));
  let i,
    s = new Promise((l) => {
      i = l;
    }),
    a = o.startViewTransition(() => (i(), Tx(e)));
  a.ready.catch((l) => {});
  let { onViewTransitionCreated: c } = r;
  return c && qe(e, () => c({ transition: a, from: t, to: n })), s;
}
function Tx(e) {
  return new Promise((t) => {
    ks({ read: () => setTimeout(t) }, { injector: e });
  });
}
var Nb = new M(""),
  Ab = (() => {
    class e {
      currentNavigation = j(null, { equal: () => !1 });
      currentTransition = null;
      lastSuccessfulNavigation = null;
      events = new Ae();
      transitionAbortWithErrorSubject = new Ae();
      configLoader = f(Ib);
      environmentInjector = f(je);
      destroyRef = f(Tt);
      urlSerializer = f(ha);
      rootContexts = f(Oi);
      location = f(Pr);
      inputBindingEnabled = f(Cu, { optional: !0 }) !== null;
      titleStrategy = f(Sm);
      options = f(Fi, { optional: !0 }) || {};
      paramsInheritanceStrategy =
        this.options.paramsInheritanceStrategy || "emptyOnly";
      urlHandlingStrategy = f(Du);
      createViewTransition = f(Mm, { optional: !0 });
      navigationErrorHandler = f(Nb, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => V(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let n = (o) => this.events.next(new lu(o)),
          r = (o) => this.events.next(new uu(o));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          });
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        ze(() => {
          this.transitions?.next(
            B(b({}, n), {
              extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
              targetSnapshot: null,
              targetRouterState: null,
              guards: { canActivateChecks: [], canDeactivateChecks: [] },
              guardsResult: null,
              abortController: new AbortController(),
              id: r,
            })
          );
        });
      }
      setupNavigations(n) {
        return (
          (this.transitions = new et(null)),
          this.transitions.pipe(
            We((r) => r !== null),
            ut((r) => {
              let o = !1;
              return V(r).pipe(
                ut((i) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(
                        r,
                        "",
                        It.SupersededByNewNavigation
                      ),
                      lt
                    );
                  (this.currentTransition = r),
                    this.currentNavigation.set({
                      id: i.id,
                      initialUrl: i.rawUrl,
                      extractedUrl: i.extractedUrl,
                      targetBrowserUrl:
                        typeof i.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(i.extras.browserUrl)
                          : i.extras.browserUrl,
                      trigger: i.source,
                      extras: i.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? B(b({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                      abort: () => i.abortController.abort(),
                    });
                  let s =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    a = i.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!s && a !== "reload")
                    return (
                      this.events.next(
                        new fr(
                          i.id,
                          this.urlSerializer.serialize(i.rawUrl),
                          "",
                          ia.IgnoredSameUrlNavigation
                        )
                      ),
                      i.resolve(!1),
                      lt
                    );
                  if (this.urlHandlingStrategy.shouldProcessUrl(i.rawUrl))
                    return V(i).pipe(
                      ut(
                        (c) => (
                          this.events.next(
                            new ko(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              c.source,
                              c.restoredState
                            )
                          ),
                          c.id !== this.navigationId ? lt : Promise.resolve(c)
                        )
                      ),
                      Cx(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy
                      ),
                      le((c) => {
                        (r.targetSnapshot = c.targetSnapshot),
                          (r.urlAfterRedirects = c.urlAfterRedirects),
                          this.currentNavigation.update(
                            (u) => ((u.finalUrl = c.urlAfterRedirects), u)
                          );
                        let l = new sa(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot
                        );
                        this.events.next(l);
                      })
                    );
                  if (
                    s &&
                    this.urlHandlingStrategy.shouldProcessUrl(i.currentRawUrl)
                  ) {
                    let {
                        id: c,
                        extractedUrl: l,
                        source: u,
                        restoredState: d,
                        extras: g,
                      } = i,
                      p = new ko(c, this.urlSerializer.serialize(l), u, d);
                    this.events.next(p);
                    let C = fb(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = r =
                        B(b({}, i), {
                          targetSnapshot: C,
                          urlAfterRedirects: l,
                          extras: B(b({}, g), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      this.currentNavigation.update(
                        (N) => ((N.finalUrl = l), N)
                      ),
                      V(r)
                    );
                  } else
                    return (
                      this.events.next(
                        new fr(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          "",
                          ia.IgnoredByUrlHandlingStrategy
                        )
                      ),
                      i.resolve(!1),
                      lt
                    );
                }),
                le((i) => {
                  let s = new iu(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot
                  );
                  this.events.next(s);
                }),
                J(
                  (i) => (
                    (this.currentTransition = r =
                      B(b({}, i), {
                        guards: UT(
                          i.targetSnapshot,
                          i.currentSnapshot,
                          this.rootContexts
                        ),
                      })),
                    r
                  )
                ),
                KT(this.environmentInjector, (i) => this.events.next(i)),
                le((i) => {
                  if (
                    ((r.guardsResult = i.guardsResult),
                    i.guardsResult && typeof i.guardsResult != "boolean")
                  )
                    throw yu(this.urlSerializer, i.guardsResult);
                  let s = new su(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                    !!i.guardsResult
                  );
                  this.events.next(s);
                }),
                We((i) =>
                  i.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(i, "", It.GuardRejected),
                      !1)
                ),
                cm((i) => {
                  if (i.guards.canActivateChecks.length !== 0)
                    return V(i).pipe(
                      le((s) => {
                        let a = new au(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      }),
                      ut((s) => {
                        let a = !1;
                        return V(s).pipe(
                          Ex(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector
                          ),
                          le({
                            next: () => (a = !0),
                            complete: () => {
                              a ||
                                this.cancelNavigationTransition(
                                  s,
                                  "",
                                  It.NoDataFromResolver
                                );
                            },
                          })
                        );
                      }),
                      le((s) => {
                        let a = new cu(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      })
                    );
                }),
                cm((i) => {
                  let s = (a) => {
                    let c = [];
                    if (a.routeConfig?.loadComponent) {
                      let l = ki(a) ?? this.environmentInjector;
                      c.push(
                        this.configLoader.loadComponent(l, a.routeConfig).pipe(
                          le((u) => {
                            a.component = u;
                          }),
                          J(() => {})
                        )
                      );
                    }
                    for (let l of a.children) c.push(...s(l));
                    return c;
                  };
                  return gc(s(i.targetSnapshot.root)).pipe(yr(null), Xt(1));
                }),
                cm(() => this.afterPreactivation()),
                ut(() => {
                  let { currentSnapshot: i, targetSnapshot: s } = r,
                    a = this.createViewTransition?.(
                      this.environmentInjector,
                      i.root,
                      s.root
                    );
                  return a ? we(a).pipe(J(() => r)) : V(r);
                }),
                J((i) => {
                  let s = PT(
                    n.routeReuseStrategy,
                    i.targetSnapshot,
                    i.currentRouterState
                  );
                  return (
                    (this.currentTransition = r =
                      B(b({}, i), { targetRouterState: s })),
                    this.currentNavigation.update(
                      (a) => ((a.targetRouterState = s), a)
                    ),
                    r
                  );
                }),
                le(() => {
                  this.events.next(new aa());
                }),
                jT(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (i) => this.events.next(i),
                  this.inputBindingEnabled
                ),
                Xt(1),
                yc(
                  new te((i) => {
                    let s = r.abortController.signal,
                      a = () => i.next();
                    return (
                      s.addEventListener("abort", a),
                      () => s.removeEventListener("abort", a)
                    );
                  }).pipe(
                    We(() => !o && !r.targetRouterState),
                    le(() => {
                      this.cancelNavigationTransition(
                        r,
                        r.abortController.signal.reason + "",
                        It.Aborted
                      );
                    })
                  )
                ),
                le({
                  next: (i) => {
                    (o = !0),
                      (this.lastSuccessfulNavigation = ze(
                        this.currentNavigation
                      )),
                      this.events.next(
                        new Yt(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          this.urlSerializer.serialize(i.urlAfterRedirects)
                        )
                      ),
                      this.titleStrategy?.updateTitle(
                        i.targetRouterState.snapshot
                      ),
                      i.resolve(!0);
                  },
                  complete: () => {
                    o = !0;
                  },
                }),
                yc(
                  this.transitionAbortWithErrorSubject.pipe(
                    le((i) => {
                      throw i;
                    })
                  )
                ),
                Tn(() => {
                  o ||
                    this.cancelNavigationTransition(
                      r,
                      "",
                      It.SupersededByNewNavigation
                    ),
                    this.currentTransition?.id === r.id &&
                      (this.currentNavigation.set(null),
                      (this.currentTransition = null));
                }),
                Jt((i) => {
                  if (this.destroyed) return r.resolve(!1), lt;
                  if (((o = !0), yb(i)))
                    this.events.next(
                      new $n(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        i.message,
                        i.cancellationCode
                      )
                    ),
                      VT(i)
                        ? this.events.next(
                            new Ni(i.url, i.navigationBehaviorOptions)
                          )
                        : r.resolve(!1);
                  else {
                    let s = new xi(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      i,
                      r.targetSnapshot ?? void 0
                    );
                    try {
                      let a = qe(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(s)
                      );
                      if (a instanceof Ai) {
                        let { message: c, cancellationCode: l } = yu(
                          this.urlSerializer,
                          a
                        );
                        this.events.next(
                          new $n(
                            r.id,
                            this.urlSerializer.serialize(r.extractedUrl),
                            c,
                            l
                          )
                        ),
                          this.events.next(
                            new Ni(a.redirectTo, a.navigationBehaviorOptions)
                          );
                      } else throw (this.events.next(s), i);
                    } catch (a) {
                      this.options.resolveNavigationPromiseOnError
                        ? r.resolve(!1)
                        : r.reject(a);
                    }
                  }
                  return lt;
                })
              );
            })
          )
        );
      }
      cancelNavigationTransition(n, r, o) {
        let i = new $n(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          r,
          o
        );
        this.events.next(i), n.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let n = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0))
          ),
          r = ze(this.currentNavigation),
          o = r?.targetBrowserUrl ?? r?.extractedUrl;
        return n.toString() !== o?.toString() && !r?.extras.skipLocationChange;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function xx(e) {
  return e !== na;
}
var Rb = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => f(Nx), providedIn: "root" });
    }
    return e;
  })(),
  bu = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig;
    }
  },
  Nx = (() => {
    class e extends bu {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  kb = (() => {
    class e {
      urlSerializer = f(ha);
      options = f(Fi, { optional: !0 }) || {};
      canceledNavigationResolution =
        this.options.canceledNavigationResolution || "replace";
      location = f(Pr);
      urlHandlingStrategy = f(Du);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      currentUrlTree = new zn();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: n, initialUrl: r, targetBrowserUrl: o }) {
        let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r,
          s = o ?? i;
        return s instanceof zn ? this.urlSerializer.serialize(s) : s;
      }
      commitTransition({ targetRouterState: n, finalUrl: r, initialUrl: o }) {
        r && n
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
            (this.routerState = n))
          : (this.rawUrlTree = o);
      }
      routerState = fb(null);
      getRouterState() {
        return this.routerState;
      }
      stateMemento = this.createStateMemento();
      updateStateMemento() {
        this.stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      resetInternalState({ finalUrl: n }) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n ?? this.rawUrlTree
          ));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: () => f(Ax), providedIn: "root" });
    }
    return e;
  })(),
  Ax = (() => {
    class e extends kb {
      currentPageId = 0;
      lastSuccessfulId = -1;
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((r) => {
          r.type === "popstate" &&
            setTimeout(() => {
              n(r.url, r.state, "popstate");
            });
        });
      }
      handleRouterEvent(n, r) {
        n instanceof ko
          ? this.updateStateMemento()
          : n instanceof fr
          ? this.commitTransition(r)
          : n instanceof sa
          ? this.urlUpdateStrategy === "eager" &&
            (r.extras.skipLocationChange ||
              this.setBrowserUrl(this.createBrowserPath(r), r))
          : n instanceof aa
          ? (this.commitTransition(r),
            this.urlUpdateStrategy === "deferred" &&
              !r.extras.skipLocationChange &&
              this.setBrowserUrl(this.createBrowserPath(r), r))
          : n instanceof $n &&
            n.code !== It.SupersededByNewNavigation &&
            n.code !== It.Redirect
          ? this.restoreHistory(r)
          : n instanceof xi
          ? this.restoreHistory(r, !0)
          : n instanceof Yt &&
            ((this.lastSuccessfulId = n.id),
            (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, { extras: r, id: o }) {
        let { replaceUrl: i, state: s } = r;
        if (this.location.isCurrentPathEqualTo(n) || i) {
          let a = this.browserPageId,
            c = b(b({}, s), this.generateNgRouterState(o, a));
          this.location.replaceState(n, "", c);
        } else {
          let a = b(
            b({}, s),
            this.generateNgRouterState(o, this.browserPageId + 1)
          );
          this.location.go(n, "", a);
        }
      }
      restoreHistory(n, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.getCurrentUrlTree() === n.finalUrl &&
              i === 0 &&
              (this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (r && this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, r) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: r }
          : { navigationId: n };
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function xm(e, t) {
  e.events
    .pipe(
      We(
        (n) =>
          n instanceof Yt ||
          n instanceof $n ||
          n instanceof xi ||
          n instanceof fr
      ),
      J((n) =>
        n instanceof Yt || n instanceof fr
          ? 0
          : (
              n instanceof $n
                ? n.code === It.Redirect ||
                  n.code === It.SupersededByNewNavigation
                : !1
            )
          ? 2
          : 1
      ),
      We((n) => n !== 2),
      Xt(1)
    )
    .subscribe(() => {
      t();
    });
}
var Rx = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  kx = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Ne = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      disposed = !1;
      nonRouterCurrentEntryChangeSubscription;
      console = f(Eh);
      stateManager = f(kb);
      options = f(Fi, { optional: !0 }) || {};
      pendingTasks = f(Pn);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      navigationTransitions = f(Ab);
      urlSerializer = f(ha);
      location = f(Pr);
      urlHandlingStrategy = f(Du);
      injector = f(je);
      _events = new Ae();
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      navigated = !1;
      routeReuseStrategy = f(Rb);
      onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
      config = f(ga, { optional: !0 })?.flat() ?? [];
      componentInputBindingEnabled = !!f(Cu, { optional: !0 });
      currentNavigation =
        this.navigationTransitions.currentNavigation.asReadonly();
      constructor() {
        this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this).subscribe({
            error: (n) => {
              this.console.warn(n);
            },
          }),
          this.subscribeToNavigationEvents();
      }
      eventsSubscription = new Ie();
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = ze(this.navigationTransitions.currentNavigation);
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof $n &&
                  r.code !== It.Redirect &&
                  r.code !== It.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof Yt) this.navigated = !0;
              else if (r instanceof Ni) {
                let s = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  c = b(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        xx(o.source),
                    },
                    s
                  );
                this.scheduleNavigation(a, na, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            AT(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              na,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, r, o) => {
              this.navigateToSyncWithBrowser(n, o, r);
            }
          );
      }
      navigateToSyncWithBrowser(n, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let c = b({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (i.state = c);
        }
        let a = this.parseUrl(n);
        this.scheduleNavigation(a, r, s, i).catch((c) => {
          this.disposed || this.injector.get(yt)(c);
        });
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return ze(this.navigationTransitions.currentNavigation);
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Im)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this._events.unsubscribe(),
          this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: c,
          } = r,
          l = c ? this.currentUrlTree.fragment : s,
          u = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            u = b(b({}, this.currentUrlTree.queryParams), i);
            break;
          case "preserve":
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = i || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let g = o ? o.snapshot : this.routerState.snapshot.root;
          d = cb(g);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return lb(d, n, u, l ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = Vr(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, na, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return Ox(n), this.navigateByUrl(this.createUrlTree(n, r), r);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, r) {
        let o;
        if (
          (r === !0 ? (o = b({}, Rx)) : r === !1 ? (o = b({}, kx)) : (o = r),
          Vr(n))
        )
          return $0(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return $0(this.currentUrlTree, i, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (r, [o, i]) => (i != null && (r[o] = i), r),
          {}
        );
      }
      scheduleNavigation(n, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, c, l;
        s
          ? ((a = s.resolve), (c = s.reject), (l = s.promise))
          : (l = new Promise((d, g) => {
              (a = d), (c = g);
            }));
        let u = this.pendingTasks.add();
        return (
          xm(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: i,
            resolve: a,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((d) => Promise.reject(d))
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Ox(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new D(4008, !1);
}
var un = (() => {
    class e {
      router;
      route;
      tabIndexAttribute;
      renderer;
      el;
      locationStrategy;
      reactiveHref = j(null);
      get href() {
        return ze(this.reactiveHref);
      }
      set href(n) {
        this.reactiveHref.set(n);
      }
      target;
      queryParams;
      fragment;
      queryParamsHandling;
      state;
      info;
      relativeTo;
      isAnchorElement;
      subscription;
      onChanges = new Ae();
      applicationErrorHandler = f(yt);
      options = f(Fi, { optional: !0 });
      constructor(n, r, o, i, s, a) {
        (this.router = n),
          (this.route = r),
          (this.tabIndexAttribute = o),
          (this.renderer = i),
          (this.el = s),
          (this.locationStrategy = a),
          this.reactiveHref.set(f(new Fl("href"), { optional: !0 }));
        let c = s.nativeElement.tagName?.toLowerCase();
        (this.isAnchorElement =
          c === "a" ||
          c === "area" ||
          !!(
            typeof customElements == "object" &&
            customElements.get(c)?.observedAttributes?.includes?.("href")
          )),
          this.isAnchorElement
            ? this.setTabIndexIfNotOnNativeEl("0")
            : this.subscribeToNavigationEventsIfNecessary();
      }
      subscribeToNavigationEventsIfNecessary() {
        if (this.subscription !== void 0 || !this.isAnchorElement) return;
        let n = this.preserveFragment,
          r = (o) => o === "merge" || o === "preserve";
        (n ||= r(this.queryParamsHandling)),
          (n ||=
            !this.queryParamsHandling &&
            !r(this.options?.defaultQueryParamsHandling)),
          n &&
            (this.subscription = this.router.events.subscribe((o) => {
              o instanceof Yt && this.updateHref();
            }));
      }
      preserveFragment = !1;
      skipLocationChange = !1;
      replaceUrl = !1;
      setTabIndexIfNotOnNativeEl(n) {
        this.tabIndexAttribute != null ||
          this.isAnchorElement ||
          this.applyAttributeValue("tabindex", n);
      }
      ngOnChanges(n) {
        this.isAnchorElement &&
          (this.updateHref(), this.subscribeToNavigationEventsIfNecessary()),
          this.onChanges.next(this);
      }
      routerLinkInput = null;
      set routerLink(n) {
        n == null
          ? ((this.routerLinkInput = null),
            this.setTabIndexIfNotOnNativeEl(null))
          : (Vr(n)
              ? (this.routerLinkInput = n)
              : (this.routerLinkInput = Array.isArray(n) ? n : [n]),
            this.setTabIndexIfNotOnNativeEl("0"));
      }
      onClick(n, r, o, i, s) {
        let a = this.urlTree;
        if (
          a === null ||
          (this.isAnchorElement &&
            (n !== 0 ||
              r ||
              o ||
              i ||
              s ||
              (typeof this.target == "string" && this.target != "_self")))
        )
          return !0;
        let c = {
          skipLocationChange: this.skipLocationChange,
          replaceUrl: this.replaceUrl,
          state: this.state,
          info: this.info,
        };
        return (
          this.router.navigateByUrl(a, c)?.catch((l) => {
            this.applicationErrorHandler(l);
          }),
          !this.isAnchorElement
        );
      }
      ngOnDestroy() {
        this.subscription?.unsubscribe();
      }
      updateHref() {
        let n = this.urlTree;
        this.reactiveHref.set(
          n !== null && this.locationStrategy
            ? this.locationStrategy?.prepareExternalUrl(
                this.router.serializeUrl(n)
              ) ?? ""
            : null
        );
      }
      applyAttributeValue(n, r) {
        let o = this.renderer,
          i = this.el.nativeElement;
        r !== null ? o.setAttribute(i, n, r) : o.removeAttribute(i, n);
      }
      get urlTree() {
        return this.routerLinkInput === null
          ? null
          : Vr(this.routerLinkInput)
          ? this.routerLinkInput
          : this.router.createUrlTree(this.routerLinkInput, {
              relativeTo:
                this.relativeTo !== void 0 ? this.relativeTo : this.route,
              queryParams: this.queryParams,
              fragment: this.fragment,
              queryParamsHandling: this.queryParamsHandling,
              preserveFragment: this.preserveFragment,
            });
      }
      static ɵfac = function (r) {
        return new (r || e)(k(Ne), k(St), xs("tabindex"), k(En), k(_t), k(bi));
      };
      static ɵdir = de({
        type: e,
        selectors: [["", "routerLink", ""]],
        hostVars: 2,
        hostBindings: function (r, o) {
          r & 1 &&
            O("click", function (s) {
              return o.onClick(
                s.button,
                s.ctrlKey,
                s.shiftKey,
                s.altKey,
                s.metaKey
              );
            }),
            r & 2 && an("href", o.reactiveHref(), eh)("target", o.target);
        },
        inputs: {
          target: "target",
          queryParams: "queryParams",
          fragment: "fragment",
          queryParamsHandling: "queryParamsHandling",
          state: "state",
          info: "info",
          relativeTo: "relativeTo",
          preserveFragment: [2, "preserveFragment", "preserveFragment", _i],
          skipLocationChange: [
            2,
            "skipLocationChange",
            "skipLocationChange",
            _i,
          ],
          replaceUrl: [2, "replaceUrl", "replaceUrl", _i],
          routerLink: "routerLink",
        },
        features: [Bt],
      });
    }
    return e;
  })(),
  va = (() => {
    class e {
      router;
      element;
      renderer;
      cdr;
      link;
      links;
      classes = [];
      routerEventsSubscription;
      linkInputChangesSubscription;
      _isActive = !1;
      get isActive() {
        return this._isActive;
      }
      routerLinkActiveOptions = { exact: !1 };
      ariaCurrentWhenActive;
      isActiveChange = new De();
      constructor(n, r, o, i, s) {
        (this.router = n),
          (this.element = r),
          (this.renderer = o),
          (this.cdr = i),
          (this.link = s),
          (this.routerEventsSubscription = n.events.subscribe((a) => {
            a instanceof Yt && this.update();
          }));
      }
      ngAfterContentInit() {
        V(this.links.changes, V(null))
          .pipe(ei())
          .subscribe((n) => {
            this.update(), this.subscribeToEachLinkOnChanges();
          });
      }
      subscribeToEachLinkOnChanges() {
        this.linkInputChangesSubscription?.unsubscribe();
        let n = [...this.links.toArray(), this.link]
          .filter((r) => !!r)
          .map((r) => r.onChanges);
        this.linkInputChangesSubscription = we(n)
          .pipe(ei())
          .subscribe((r) => {
            this._isActive !== this.isLinkActive(this.router)(r) &&
              this.update();
          });
      }
      set routerLinkActive(n) {
        let r = Array.isArray(n) ? n : n.split(" ");
        this.classes = r.filter((o) => !!o);
      }
      ngOnChanges(n) {
        this.update();
      }
      ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe(),
          this.linkInputChangesSubscription?.unsubscribe();
      }
      update() {
        !this.links ||
          !this.router.navigated ||
          queueMicrotask(() => {
            let n = this.hasActiveLinks();
            this.classes.forEach((r) => {
              n
                ? this.renderer.addClass(this.element.nativeElement, r)
                : this.renderer.removeClass(this.element.nativeElement, r);
            }),
              n && this.ariaCurrentWhenActive !== void 0
                ? this.renderer.setAttribute(
                    this.element.nativeElement,
                    "aria-current",
                    this.ariaCurrentWhenActive.toString()
                  )
                : this.renderer.removeAttribute(
                    this.element.nativeElement,
                    "aria-current"
                  ),
              this._isActive !== n &&
                ((this._isActive = n),
                this.cdr.markForCheck(),
                this.isActiveChange.emit(n));
          });
      }
      isLinkActive(n) {
        let r = Fx(this.routerLinkActiveOptions)
          ? this.routerLinkActiveOptions
          : this.routerLinkActiveOptions.exact || !1;
        return (o) => {
          let i = o.urlTree;
          return i ? n.isActive(i, r) : !1;
        };
      }
      hasActiveLinks() {
        let n = this.isLinkActive(this.router);
        return (this.link && n(this.link)) || this.links.some(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(Ne), k(_t), k(En), k(kr), k(un, 8));
      };
      static ɵdir = de({
        type: e,
        selectors: [["", "routerLinkActive", ""]],
        contentQueries: function (r, o, i) {
          if ((r & 1 && Nh(i, un, 5), r & 2)) {
            let s;
            Ct((s = Et())) && (o.links = s);
          }
        },
        inputs: {
          routerLinkActiveOptions: "routerLinkActiveOptions",
          ariaCurrentWhenActive: "ariaCurrentWhenActive",
          routerLinkActive: "routerLinkActive",
        },
        outputs: { isActiveChange: "isActiveChange" },
        exportAs: ["routerLinkActive"],
        features: [Bt],
      });
    }
    return e;
  })();
function Fx(e) {
  return !!e.paths;
}
var Lx = new M("");
function Nm(e, ...t) {
  return xn([
    { provide: ga, multi: !0, useValue: e },
    [],
    { provide: St, useFactory: Vx, deps: [Ne] },
    { provide: kl, multi: !0, useFactory: Ux },
    t.map((n) => n.ɵproviders),
  ]);
}
function Vx(e) {
  return e.routerState.root;
}
function jx(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function Ux() {
  let e = f(gt);
  return (t) => {
    let n = e.get(cr);
    if (t !== n.components[0]) return;
    let r = e.get(Ne),
      o = e.get(Bx);
    e.get(Hx) === 1 && r.initialNavigation(),
      e.get($x, null, { optional: !0 })?.setUpPreloading(),
      e.get(Lx, null, { optional: !0 })?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var Bx = new M("", { factory: () => new Ae() }),
  Hx = new M("", { providedIn: "root", factory: () => 1 });
var $x = new M("");
function Am(e) {
  jn("NgRouterViewTransitions");
  let t = [
    { provide: Mm, useValue: xb },
    {
      provide: Tm,
      useValue: b({ skipNextTransition: !!e?.skipInitialTransition }, e),
    },
  ];
  return jx(9, t);
}
var Hb = (() => {
    class e {
      _renderer;
      _elementRef;
      onChange = (n) => {};
      onTouched = () => {};
      constructor(n, r) {
        (this._renderer = n), (this._elementRef = r);
      }
      setProperty(n, r) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, r);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(En), k(_t));
      };
      static ɵdir = de({ type: e });
    }
    return e;
  })(),
  Ia = (() => {
    class e extends Hb {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵdir = de({ type: e, features: [nt] });
    }
    return e;
  })(),
  Ur = new M("");
var zx = { provide: Ur, useExisting: dt(() => kt), multi: !0 };
function Gx() {
  let e = cn() ? cn().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var Wx = new M(""),
  kt = (() => {
    class e extends Hb {
      _compositionMode;
      _composing = !1;
      constructor(n, r, o) {
        super(n, r),
          (this._compositionMode = o),
          this._compositionMode == null && (this._compositionMode = !Gx());
      }
      writeValue(n) {
        let r = n ?? "";
        this.setProperty("value", r);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(En), k(_t), k(Wx, 8));
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("input", function (s) {
              return o._handleInput(s.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (s) {
              return o._compositionEnd(s.target.value);
            });
        },
        standalone: !1,
        features: [zt([zx]), nt],
      });
    }
    return e;
  })();
function Pm(e) {
  return e == null || Fm(e) === 0;
}
function Fm(e) {
  return e == null
    ? null
    : Array.isArray(e) || typeof e == "string"
    ? e.length
    : e instanceof Set
    ? e.size
    : null;
}
var Bi = new M(""),
  Sa = new M(""),
  qx =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Rt = class {
    static min(t) {
      return $b(t);
    }
    static max(t) {
      return Zx(t);
    }
    static required(t) {
      return Yx(t);
    }
    static requiredTrue(t) {
      return Qx(t);
    }
    static email(t) {
      return Kx(t);
    }
    static minLength(t) {
      return Jx(t);
    }
    static maxLength(t) {
      return Xx(t);
    }
    static pattern(t) {
      return eN(t);
    }
    static nullValidator(t) {
      return Iu();
    }
    static compose(t) {
      return Yb(t);
    }
    static composeAsync(t) {
      return Qb(t);
    }
  };
function $b(e) {
  return (t) => {
    if (t.value == null || e == null) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function Zx(e) {
  return (t) => {
    if (t.value == null || e == null) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function Yx(e) {
  return Pm(e.value) ? { required: !0 } : null;
}
function Qx(e) {
  return e.value === !0 ? null : { required: !0 };
}
function Kx(e) {
  return Pm(e.value) || qx.test(e.value) ? null : { email: !0 };
}
function Jx(e) {
  return (t) => {
    let n = t.value?.length ?? Fm(t.value);
    return n === null || n === 0
      ? null
      : n < e
      ? { minlength: { requiredLength: e, actualLength: n } }
      : null;
  };
}
function Xx(e) {
  return (t) => {
    let n = t.value?.length ?? Fm(t.value);
    return n !== null && n > e
      ? { maxlength: { requiredLength: e, actualLength: n } }
      : null;
  };
}
function eN(e) {
  if (!e) return Iu;
  let t, n;
  return (
    typeof e == "string"
      ? ((n = ""),
        e.charAt(0) !== "^" && (n += "^"),
        (n += e),
        e.charAt(e.length - 1) !== "$" && (n += "$"),
        (t = new RegExp(n)))
      : ((n = e.toString()), (t = e)),
    (r) => {
      if (Pm(r.value)) return null;
      let o = r.value;
      return t.test(o)
        ? null
        : { pattern: { requiredPattern: n, actualValue: o } };
    }
  );
}
function Iu(e) {
  return null;
}
function zb(e) {
  return e != null;
}
function Gb(e) {
  return Ar(e) ? we(e) : e;
}
function Wb(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? b(b({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function qb(e, t) {
  return t.map((n) => n(e));
}
function tN(e) {
  return !e.validate;
}
function Zb(e) {
  return e.map((t) => (tN(t) ? t : (n) => t.validate(n)));
}
function Yb(e) {
  if (!e) return null;
  let t = e.filter(zb);
  return t.length == 0
    ? null
    : function (n) {
        return Wb(qb(n, t));
      };
}
function Lm(e) {
  return e != null ? Yb(Zb(e)) : null;
}
function Qb(e) {
  if (!e) return null;
  let t = e.filter(zb);
  return t.length == 0
    ? null
    : function (n) {
        let r = qb(n, t).map(Gb);
        return Qd(r).pipe(J(Wb));
      };
}
function Vm(e) {
  return e != null ? Qb(Zb(e)) : null;
}
function Ob(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function Kb(e) {
  return e._rawValidators;
}
function Jb(e) {
  return e._rawAsyncValidators;
}
function Rm(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function Su(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function Pb(e, t) {
  let n = Rm(t);
  return (
    Rm(e).forEach((o) => {
      Su(n, o) || n.push(o);
    }),
    n
  );
}
function Fb(e, t) {
  return Rm(t).filter((n) => !Su(e, n));
}
var Mu = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = Lm(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Vm(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  hr = class extends Mu {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  dn = class extends Mu {
    _parent = null;
    name = null;
    valueAccessor = null;
  },
  Tu = class {
    _cd;
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  nN = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  yz = B(b({}, nN), { "[class.ng-submitted]": "isSubmitted" }),
  fn = (() => {
    class e extends Tu {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(dn, 2));
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (r, o) {
          r & 2 &&
            fe("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        standalone: !1,
        features: [nt],
      });
    }
    return e;
  })(),
  Br = (() => {
    class e extends Tu {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(hr, 10));
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (r, o) {
          r & 2 &&
            fe("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        standalone: !1,
        features: [nt],
      });
    }
    return e;
  })();
var ya = "VALID",
  wu = "INVALID",
  Li = "PENDING",
  _a = "DISABLED",
  jr = class {},
  xu = class extends jr {
    value;
    source;
    constructor(t, n) {
      super(), (this.value = t), (this.source = n);
    }
  },
  Ca = class extends jr {
    pristine;
    source;
    constructor(t, n) {
      super(), (this.pristine = t), (this.source = n);
    }
  },
  Ea = class extends jr {
    touched;
    source;
    constructor(t, n) {
      super(), (this.touched = t), (this.source = n);
    }
  },
  Vi = class extends jr {
    status;
    source;
    constructor(t, n) {
      super(), (this.status = t), (this.source = n);
    }
  },
  Nu = class extends jr {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  },
  Au = class extends jr {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  };
function jm(e) {
  return (Pu(e) ? e.validators : e) || null;
}
function rN(e) {
  return Array.isArray(e) ? Lm(e) : e || null;
}
function Um(e, t) {
  return (Pu(t) ? t.asyncValidators : e) || null;
}
function oN(e) {
  return Array.isArray(e) ? Vm(e) : e || null;
}
function Pu(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function Xb(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new D(1e3, "");
  if (!r[n]) throw new D(1001, "");
}
function eC(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new D(1002, "");
  });
}
var ji = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
      this._assignValidators(t), this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return ze(this.statusReactive);
    }
    set status(t) {
      ze(() => this.statusReactive.set(t));
    }
    _status = Dt(() => this.statusReactive());
    statusReactive = j(void 0);
    get valid() {
      return this.status === ya;
    }
    get invalid() {
      return this.status === wu;
    }
    get pending() {
      return this.status == Li;
    }
    get disabled() {
      return this.status === _a;
    }
    get enabled() {
      return this.status !== _a;
    }
    errors;
    get pristine() {
      return ze(this.pristineReactive);
    }
    set pristine(t) {
      ze(() => this.pristineReactive.set(t));
    }
    _pristine = Dt(() => this.pristineReactive());
    pristineReactive = j(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return ze(this.touchedReactive);
    }
    set touched(t) {
      ze(() => this.touchedReactive.set(t));
    }
    _touched = Dt(() => this.touchedReactive());
    touchedReactive = j(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new Ae();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(Pb(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(Pb(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(Fb(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(Fb(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return Su(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return Su(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsTouched(B(b({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Ea(!0, r));
    }
    markAllAsDirty(t = {}) {
      this.markAsDirty({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((n) => n.markAllAsDirty(t));
    }
    markAllAsTouched(t = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((n) => n.markAllAsTouched(t));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsUntouched({
          onlySelf: !0,
          emitEvent: t.emitEvent,
          sourceControl: r,
        });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Ea(!1, r));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsDirty(B(b({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Ca(!1, r));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Ca(!0, r));
    }
    markAsPending(t = {}) {
      this.status = Li;
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Vi(this.status, n)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(B(b({}, t), { sourceControl: n }));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = _a),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(B(b({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let r = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new xu(this.value, r)),
        this._events.next(new Vi(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(B(b({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = ya),
        this._forEachChild((r) => {
          r.enable(B(b({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(B(b({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === ya || this.status === Li) &&
            this._runAsyncValidator(r, t.emitEvent);
      }
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new xu(this.value, n)),
        this._events.next(new Vi(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            B(b({}, t), { sourceControl: n })
          );
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? _a : ya;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        (this.status = Li),
          (this._hasOwnPendingAsyncValidator = {
            emitEvent: n !== !1,
            shouldHaveEmitted: t !== !1,
          });
        let r = Gb(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((o) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(o, { emitEvent: n, shouldHaveEmitted: t });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t =
          (this._hasOwnPendingAsyncValidator?.emitEvent ||
            this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ??
          !1;
        return (this._hasOwnPendingAsyncValidator = null), t;
      }
      return !1;
    }
    setErrors(t, n = {}) {
      (this.errors = t),
        this._updateControlsErrors(
          n.emitEvent !== !1,
          this,
          n.shouldHaveEmitted
        );
    }
    get(t) {
      let n = t;
      return n == null ||
        (Array.isArray(n) || (n = n.split(".")), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Vi(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r);
    }
    _initObservables() {
      (this.valueChanges = new De()), (this.statusChanges = new De());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? _a
        : this.errors
        ? wu
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Li)
        ? Li
        : this._anyControlsHaveStatus(wu)
        ? wu
        : ya;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        o = this.pristine !== r;
      (this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new Ca(this.pristine, n));
    }
    _updateTouched(t = {}, n) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Ea(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n);
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      Pu(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = rN(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = oN(this._rawAsyncValidators));
    }
  },
  Ui = class extends ji {
    constructor(t, n, r) {
      super(jm(n), Um(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, n, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      eC(this, !0, t),
        Object.keys(t).forEach((r) => {
          Xb(this, !0, r),
            this.controls[r].setValue(t[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, n, r) => ((t[r] = n.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var km = class extends Ui {};
var Po = new M("", { providedIn: "root", factory: () => Ma }),
  Ma = "always";
function tC(e, t) {
  return [...t.path, e];
}
function wa(e, t, n = Ma) {
  Bm(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    sN(e, t),
    cN(e, t),
    aN(e, t),
    iN(e, t);
}
function Ru(e, t, n = !0) {
  let r = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    Ou(e, t),
    e &&
      (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
}
function ku(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function iN(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      });
  }
}
function Bm(e, t) {
  let n = Kb(e);
  t.validator !== null
    ? e.setValidators(Ob(n, t.validator))
    : typeof n == "function" && e.setValidators([n]);
  let r = Jb(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(Ob(r, t.asyncValidator))
    : typeof r == "function" && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  ku(t._rawValidators, o), ku(t._rawAsyncValidators, o);
}
function Ou(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = Kb(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = Jb(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return ku(t._rawValidators, r), ku(t._rawAsyncValidators, r), n;
}
function sN(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && nC(e, t);
  });
}
function aN(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && nC(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function nC(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function cN(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function rC(e, t) {
  e == null, Bm(e, t);
}
function lN(e, t) {
  return Ou(e, t);
}
function Hm(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function uN(e) {
  return Object.getPrototypeOf(e.constructor) === Ia;
}
function oC(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function $m(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === kt ? (n = i) : uN(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function dN(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var fN = { provide: hr, useExisting: dt(() => Fo) },
  ba = Promise.resolve(),
  Fo = (() => {
    class e extends hr {
      callSetDisabledState;
      get submitted() {
        return ze(this.submittedReactive);
      }
      _submitted = Dt(() => this.submittedReactive());
      submittedReactive = j(!1);
      _directives = new Set();
      form;
      ngSubmit = new De();
      options;
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.form = new Ui({}, Lm(n), Vm(r)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        ba.then(() => {
          let r = this._findContainer(n.path);
          (n.control = r.registerControl(n.name, n.control)),
            wa(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n);
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        ba.then(() => {
          let r = this._findContainer(n.path);
          r && r.removeControl(n.name), this._directives.delete(n);
        });
      }
      addFormGroup(n) {
        ba.then(() => {
          let r = this._findContainer(n.path),
            o = new Ui({});
          rC(o, n),
            r.registerControl(n.name, o),
            o.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(n) {
        ba.then(() => {
          let r = this._findContainer(n.path);
          r && r.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        ba.then(() => {
          this.form.get(n.path).setValue(r);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          this.submittedReactive.set(!0),
          oC(this.form, this._directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Nu(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          this.submittedReactive.set(!1),
          this.form._events.next(new Au(this.form));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return n.pop(), n.length ? this.form.get(n) : this.form;
      }
      static ɵfac = function (r) {
        return new (r || e)(k(Bi, 10), k(Sa, 10), k(Po, 8));
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
          ["ng-form"],
          ["", "ngForm", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("submit", function (s) {
              return o.onSubmit(s);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { options: [0, "ngFormOptions", "options"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [zt([fN]), nt],
      });
    }
    return e;
  })();
function Lb(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Vb(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var Da = class extends ji {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, n, r) {
    super(jm(n), Um(r, n)),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Pu(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Vb(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, n = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    Lb(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    Lb(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    Vb(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var pN = (e) => e instanceof Da;
var hN = { provide: dn, useExisting: dt(() => mr) },
  jb = Promise.resolve(),
  mr = (() => {
    class e extends dn {
      _changeDetectorRef;
      callSetDisabledState;
      control = new Da();
      static ngAcceptInputType_isDisabled;
      _registered = !1;
      viewModel;
      name = "";
      isDisabled;
      model;
      options;
      update = new De();
      constructor(n, r, o, i, s, a) {
        super(),
          (this._changeDetectorRef = s),
          (this.callSetDisabledState = a),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = $m(this, i));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let r = n.name.previousValue;
            this.formDirective.removeControl({
              name: r,
              path: this._getPath(r),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          Hm(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        wa(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._checkName();
      }
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        jb.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let r = n.isDisabled.currentValue,
          o = r !== 0 && _i(r);
        jb.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? tC(n, this._parent) : [n];
      }
      static ɵfac = function (r) {
        return new (r || e)(
          k(hr, 9),
          k(Bi, 10),
          k(Sa, 10),
          k(Ur, 10),
          k(kr, 8),
          k(Po, 8)
        );
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
          options: [0, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        standalone: !1,
        features: [zt([hN]), nt, Bt],
      });
    }
    return e;
  })();
var Hr = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = de({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
        standalone: !1,
      });
    }
    return e;
  })(),
  mN = { provide: Ur, useExisting: dt(() => zm), multi: !0 },
  zm = (() => {
    class e extends Ia {
      writeValue(n) {
        let r = n ?? "";
        this.setProperty("value", r);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          n(r == "" ? null : parseFloat(r));
        };
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵdir = de({
        type: e,
        selectors: [
          ["input", "type", "number", "formControlName", ""],
          ["input", "type", "number", "formControl", ""],
          ["input", "type", "number", "ngModel", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("input", function (s) {
              return o.onChange(s.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        standalone: !1,
        features: [zt([mN]), nt],
      });
    }
    return e;
  })(),
  gN = { provide: Ur, useExisting: dt(() => Ta), multi: !0 };
var vN = (() => {
    class e {
      _accessors = [];
      add(n, r) {
        this._accessors.push([n, r]);
      }
      remove(n) {
        for (let r = this._accessors.length - 1; r >= 0; --r)
          if (this._accessors[r][1] === n) {
            this._accessors.splice(r, 1);
            return;
          }
      }
      select(n) {
        this._accessors.forEach((r) => {
          this._isSameGroup(r, n) && r[1] !== n && r[1].fireUncheck(n.value);
        });
      }
      _isSameGroup(n, r) {
        return n[0].control
          ? n[0]._parent === r._control._parent && n[1].name === r.name
          : !1;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Ta = (() => {
    class e extends Ia {
      _registry;
      _injector;
      _state;
      _control;
      _fn;
      setDisabledStateFired = !1;
      onChange = () => {};
      name;
      formControlName;
      value;
      callSetDisabledState = f(Po, { optional: !0 }) ?? Ma;
      constructor(n, r, o, i) {
        super(n, r), (this._registry = o), (this._injector = i);
      }
      ngOnInit() {
        (this._control = this._injector.get(dn)),
          this._checkName(),
          this._registry.add(this._control, this);
      }
      ngOnDestroy() {
        this._registry.remove(this);
      }
      writeValue(n) {
        (this._state = n === this.value),
          this.setProperty("checked", this._state);
      }
      registerOnChange(n) {
        (this._fn = n),
          (this.onChange = () => {
            n(this.value), this._registry.select(this);
          });
      }
      setDisabledState(n) {
        (this.setDisabledStateFired ||
          n ||
          this.callSetDisabledState === "whenDisabledForLegacyCode") &&
          this.setProperty("disabled", n),
          (this.setDisabledStateFired = !0);
      }
      fireUncheck(n) {
        this.writeValue(n);
      }
      _checkName() {
        this.name && this.formControlName && (this.name, this.formControlName),
          !this.name &&
            this.formControlName &&
            (this.name = this.formControlName);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(En), k(_t), k(vN), k(gt));
      };
      static ɵdir = de({
        type: e,
        selectors: [
          ["input", "type", "radio", "formControlName", ""],
          ["input", "type", "radio", "formControl", ""],
          ["input", "type", "radio", "ngModel", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("change", function () {
              return o.onChange();
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: {
          name: "name",
          formControlName: "formControlName",
          value: "value",
        },
        standalone: !1,
        features: [zt([gN]), nt],
      });
    }
    return e;
  })();
var Gm = new M(""),
  yN = { provide: dn, useExisting: dt(() => Wm) },
  Wm = (() => {
    class e extends dn {
      _ngModelWarningConfig;
      callSetDisabledState;
      viewModel;
      form;
      set isDisabled(n) {}
      model;
      update = new De();
      static _ngModelWarningSentOnce = !1;
      _ngModelWarningSent = !1;
      constructor(n, r, o, i, s) {
        super(),
          (this._ngModelWarningConfig = i),
          (this.callSetDisabledState = s),
          this._setValidators(n),
          this._setAsyncValidators(r),
          (this.valueAccessor = $m(this, o));
      }
      ngOnChanges(n) {
        if (this._isControlChanged(n)) {
          let r = n.form.previousValue;
          r && Ru(r, this, !1),
            wa(this.form, this, this.callSetDisabledState),
            this.form.updateValueAndValidity({ emitEvent: !1 });
        }
        Hm(n, this.viewModel) &&
          (this.form.setValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.form && Ru(this.form, this, !1);
      }
      get path() {
        return [];
      }
      get control() {
        return this.form;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _isControlChanged(n) {
        return n.hasOwnProperty("form");
      }
      static ɵfac = function (r) {
        return new (r || e)(
          k(Bi, 10),
          k(Sa, 10),
          k(Ur, 10),
          k(Gm, 8),
          k(Po, 8)
        );
      };
      static ɵdir = de({
        type: e,
        selectors: [["", "formControl", ""]],
        inputs: {
          form: [0, "formControl", "form"],
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [zt([yN]), nt, Bt],
      });
    }
    return e;
  })(),
  _N = { provide: hr, useExisting: dt(() => qm) },
  qm = (() => {
    class e extends hr {
      callSetDisabledState;
      get submitted() {
        return ze(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      _submitted = Dt(() => this._submittedReactive());
      _submittedReactive = j(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new De();
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          this._setValidators(n),
          this._setAsyncValidators(r);
      }
      ngOnChanges(n) {
        n.hasOwnProperty("form") &&
          (this._updateValidators(),
          this._updateDomValue(),
          this._updateRegistrations(),
          (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Ou(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let r = this.form.get(n.path);
        return (
          wa(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        Ru(n.control || null, n, !1), dN(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        this.form.get(n.path).setValue(r);
      }
      onSubmit(n) {
        return (
          this._submittedReactive.set(!0),
          oC(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Nu(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0, r = {}) {
        this.form.reset(n, r),
          this._submittedReactive.set(!1),
          r?.emitEvent !== !1 && this.form._events.next(new Au(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let r = n.control,
            o = this.form.get(n.path);
          r !== o &&
            (Ru(r || null, n),
            pN(o) && (wa(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        rC(r, n), r.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && lN(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        Bm(this.form, this), this._oldForm && Ou(this._oldForm, this);
      }
      static ɵfac = function (r) {
        return new (r || e)(k(Bi, 10), k(Sa, 10), k(Po, 8));
      };
      static ɵdir = de({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (r, o) {
          r & 1 &&
            O("submit", function (s) {
              return o.onSubmit(s);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: [0, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [zt([_N]), nt, Bt],
      });
    }
    return e;
  })();
var bN = { provide: dn, useExisting: dt(() => Zm) },
  Zm = (() => {
    class e extends dn {
      _ngModelWarningConfig;
      _added = !1;
      viewModel;
      control;
      name = null;
      set isDisabled(n) {}
      model;
      update = new De();
      static _ngModelWarningSentOnce = !1;
      _ngModelWarningSent = !1;
      constructor(n, r, o, i, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = $m(this, i));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          Hm(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return tC(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _setUpControl() {
        (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          k(hr, 13),
          k(Bi, 10),
          k(Sa, 10),
          k(Ur, 10),
          k(Gm, 8)
        );
      };
      static ɵdir = de({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [0, "formControlName", "name"],
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        standalone: !1,
        features: [zt([bN]), nt, Bt],
      });
    }
    return e;
  })();
var CN = { provide: Ur, useExisting: dt(() => Fu), multi: !0 };
function iC(e, t) {
  return e == null
    ? `${t}`
    : (t && typeof t == "object" && (t = "Object"), `${e}: ${t}`.slice(0, 50));
}
function EN(e) {
  return e.split(":")[0];
}
var Fu = (() => {
    class e extends Ia {
      value;
      _optionMap = new Map();
      _idCounter = 0;
      set compareWith(n) {
        this._compareWith = n;
      }
      _compareWith = Object.is;
      appRefInjector = f(cr).injector;
      destroyRef = f(Tt);
      cdr = f(kr);
      _queuedWrite = !1;
      _writeValueAfterRender() {
        this._queuedWrite ||
          this.appRefInjector.destroyed ||
          ((this._queuedWrite = !0),
          ks(
            {
              write: () => {
                this.destroyRef.destroyed ||
                  ((this._queuedWrite = !1), this.writeValue(this.value));
              },
            },
            { injector: this.appRefInjector }
          ));
      }
      writeValue(n) {
        this.cdr.markForCheck(), (this.value = n);
        let r = this._getOptionId(n),
          o = iC(r, n);
        this.setProperty("value", o);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          (this.value = this._getOptionValue(r)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let r of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(r), n)) return r;
        return null;
      }
      _getOptionValue(n) {
        let r = EN(n);
        return this._optionMap.has(r) ? this._optionMap.get(r) : n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵdir = de({
        type: e,
        selectors: [
          ["select", "formControlName", "", 3, "multiple", ""],
          ["select", "formControl", "", 3, "multiple", ""],
          ["select", "ngModel", "", 3, "multiple", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("change", function (s) {
              return o.onChange(s.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        standalone: !1,
        features: [zt([CN]), nt],
      });
    }
    return e;
  })(),
  sC = (() => {
    class e {
      _element;
      _renderer;
      _select;
      id;
      constructor(n, r, o) {
        (this._element = n),
          (this._renderer = r),
          (this._select = o),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(iC(this.id, n)),
          this._select._writeValueAfterRender());
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select._writeValueAfterRender();
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select._writeValueAfterRender());
      }
      static ɵfac = function (r) {
        return new (r || e)(k(_t), k(En), k(Fu, 9));
      };
      static ɵdir = de({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
        standalone: !1,
      });
    }
    return e;
  })(),
  DN = { provide: Ur, useExisting: dt(() => aC), multi: !0 };
function Ub(e, t) {
  return e == null
    ? `${t}`
    : (typeof t == "string" && (t = `'${t}'`),
      t && typeof t == "object" && (t = "Object"),
      `${e}: ${t}`.slice(0, 50));
}
function wN(e) {
  return e.split(":")[0];
}
var aC = (() => {
    class e extends Ia {
      value;
      _optionMap = new Map();
      _idCounter = 0;
      set compareWith(n) {
        this._compareWith = n;
      }
      _compareWith = Object.is;
      writeValue(n) {
        this.value = n;
        let r;
        if (Array.isArray(n)) {
          let o = n.map((i) => this._getOptionId(i));
          r = (i, s) => {
            i._setSelected(o.indexOf(s.toString()) > -1);
          };
        } else
          r = (o, i) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(r);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          let o = [],
            i = r.selectedOptions;
          if (i !== void 0) {
            let s = i;
            for (let a = 0; a < s.length; a++) {
              let c = s[a],
                l = this._getOptionValue(c.value);
              o.push(l);
            }
          } else {
            let s = r.options;
            for (let a = 0; a < s.length; a++) {
              let c = s[a];
              if (c.selected) {
                let l = this._getOptionValue(c.value);
                o.push(l);
              }
            }
          }
          (this.value = o), n(o);
        };
      }
      _registerOption(n) {
        let r = (this._idCounter++).toString();
        return this._optionMap.set(r, n), r;
      }
      _getOptionId(n) {
        for (let r of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(r)._value, n)) return r;
        return null;
      }
      _getOptionValue(n) {
        let r = wN(n);
        return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵdir = de({
        type: e,
        selectors: [
          ["select", "multiple", "", "formControlName", ""],
          ["select", "multiple", "", "formControl", ""],
          ["select", "multiple", "", "ngModel", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            O("change", function (s) {
              return o.onChange(s.target);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        standalone: !1,
        features: [zt([DN]), nt],
      });
    }
    return e;
  })(),
  cC = (() => {
    class e {
      _element;
      _renderer;
      _select;
      id;
      _value;
      constructor(n, r, o) {
        (this._element = n),
          (this._renderer = r),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(Ub(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(Ub(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, "selected", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
      static ɵfac = function (r) {
        return new (r || e)(k(_t), k(En), k(aC, 9));
      };
      static ɵdir = de({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
        standalone: !1,
      });
    }
    return e;
  })();
function IN(e) {
  return typeof e == "number" ? e : parseFloat(e);
}
var SN = (() => {
  class e {
    _validator = Iu;
    _onChange;
    _enabled;
    ngOnChanges(n) {
      if (this.inputName in n) {
        let r = this.normalizeInput(n[this.inputName].currentValue);
        (this._enabled = this.enabled(r)),
          (this._validator = this._enabled ? this.createValidator(r) : Iu),
          this._onChange && this._onChange();
      }
    }
    validate(n) {
      return this._validator(n);
    }
    registerOnValidatorChange(n) {
      this._onChange = n;
    }
    enabled(n) {
      return n != null;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = de({ type: e, features: [Bt] });
  }
  return e;
})();
var MN = { provide: Bi, useExisting: dt(() => Ym), multi: !0 },
  Ym = (() => {
    class e extends SN {
      min;
      inputName = "min";
      normalizeInput = (n) => IN(n);
      createValidator = (n) => $b(n);
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Vn(e)))(o || e);
        };
      })();
      static ɵdir = de({
        type: e,
        selectors: [
          ["input", "type", "number", "min", "", "formControlName", ""],
          ["input", "type", "number", "min", "", "formControl", ""],
          ["input", "type", "number", "min", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (r, o) {
          r & 2 && an("min", o._enabled ? o.min : null);
        },
        inputs: { min: "min" },
        standalone: !1,
        features: [zt([MN]), nt],
      });
    }
    return e;
  })();
var lC = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = Un({ type: e });
      static ɵinj = gn({});
    }
    return e;
  })(),
  Om = class extends ji {
    constructor(t, n, r) {
      super(jm(n), Um(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    at(t) {
      return this.controls[this._adjustIndex(t)];
    }
    push(t, n = {}) {
      Array.isArray(t)
        ? t.forEach((r) => {
            this.controls.push(r), this._registerControl(r);
          })
        : (this.controls.push(t), this._registerControl(t)),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    insert(t, n, r = {}) {
      this.controls.splice(t, 0, n),
        this._registerControl(n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    removeAt(t, n = {}) {
      let r = this._adjustIndex(t);
      r < 0 && (r = 0),
        this.controls[r] &&
          this.controls[r]._registerOnCollectionChange(() => {}),
        this.controls.splice(r, 1),
        this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    setControl(t, n, r = {}) {
      let o = this._adjustIndex(t);
      o < 0 && (o = 0),
        this.controls[o] &&
          this.controls[o]._registerOnCollectionChange(() => {}),
        this.controls.splice(o, 1),
        n && (this.controls.splice(o, 0, n), this._registerControl(n)),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(t, n = {}) {
      eC(this, !1, t),
        t.forEach((r, o) => {
          Xb(this, !1, o),
            this.at(o).setValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (t.forEach((r, o) => {
          this.at(o) &&
            this.at(o).patchValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = [], n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this.controls.map((t) => t.getRawValue());
    }
    clear(t = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: t.emitEvent }));
    }
    _adjustIndex(t) {
      return t < 0 ? t + this.length : t;
    }
    _syncPendingControls() {
      let t = this.controls.reduce(
        (n, r) => (r._syncPendingControls() ? !0 : n),
        !1
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      this.controls.forEach((n, r) => {
        t(n, r);
      });
    }
    _updateValue() {
      this.value = this.controls
        .filter((t) => t.enabled || this.disabled)
        .map((t) => t.value);
    }
    _anyControls(t) {
      return this.controls.some((n) => n.enabled && t(n));
    }
    _setUpControls() {
      this._forEachChild((t) => this._registerControl(t));
    }
    _allControlsDisabled() {
      for (let t of this.controls) if (t.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(t) {
      t.setParent(this),
        t._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(t) {
      return this.at(t) ?? null;
    }
  };
function Bb(e) {
  return (
    !!e &&
    (e.asyncValidators !== void 0 ||
      e.validators !== void 0 ||
      e.updateOn !== void 0)
  );
}
var uC = (() => {
  class e {
    useNonNullable = !1;
    get nonNullable() {
      let n = new e();
      return (n.useNonNullable = !0), n;
    }
    group(n, r = null) {
      let o = this._reduceControls(n),
        i = {};
      return (
        Bb(r)
          ? (i = r)
          : r !== null &&
            ((i.validators = r.validator),
            (i.asyncValidators = r.asyncValidator)),
        new Ui(o, i)
      );
    }
    record(n, r = null) {
      let o = this._reduceControls(n);
      return new km(o, r);
    }
    control(n, r, o) {
      let i = {};
      return this.useNonNullable
        ? (Bb(r) ? (i = r) : ((i.validators = r), (i.asyncValidators = o)),
          new Da(n, B(b({}, i), { nonNullable: !0 })))
        : new Da(n, r, o);
    }
    array(n, r, o) {
      let i = n.map((s) => this._createControl(s));
      return new Om(i, r, o);
    }
    _reduceControls(n) {
      let r = {};
      return (
        Object.keys(n).forEach((o) => {
          r[o] = this._createControl(n[o]);
        }),
        r
      );
    }
    _createControl(n) {
      if (n instanceof Da) return n;
      if (n instanceof ji) return n;
      if (Array.isArray(n)) {
        let r = n[0],
          o = n.length > 1 ? n[1] : null,
          i = n.length > 2 ? n[2] : null;
        return this.control(r, o, i);
      } else return this.control(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var Gn = (() => {
    class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [{ provide: Po, useValue: n.callSetDisabledState ?? Ma }],
        };
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = Un({ type: e });
      static ɵinj = gn({ imports: [lC] });
    }
    return e;
  })(),
  Lu = (() => {
    class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [
            {
              provide: Gm,
              useValue: n.warnOnNgModelWithFormControl ?? "always",
            },
            { provide: Po, useValue: n.callSetDisabledState ?? Ma },
          ],
        };
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = Un({ type: e });
      static ɵinj = gn({ imports: [lC] });
    }
    return e;
  })();
var it = { production: !0, apiUrl: "api/", hubUrl: "hubs/" };
var Wn = class e {
  baseUrl = it.apiUrl;
  http = f(At);
  likeIds = j([]);
  toggleLike(t) {
    return this.http.post(`${this.baseUrl}likes/${t}`, {}).subscribe({
      next: () => {
        this.likeIds().includes(t)
          ? this.likeIds.update((n) => n.filter((r) => r !== t))
          : this.likeIds.update((n) => [...n, t]);
      },
    });
  }
  getLikes(t, n, r) {
    let o = new wt();
    return (
      (o = o.append("pageNumber", n)),
      (o = o.append("pageSize", r)),
      (o = o.append("predicate", t)),
      this.http.get(this.baseUrl + "likes", { params: o })
    );
  }
  getLikesIds() {
    return this.http
      .get(this.baseUrl + "likes/list")
      .subscribe({ next: (t) => this.likeIds.set(t) });
  }
  clearLikeIds() {
    this.likeIds.set([]);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Ot = class e {
  router = f(Ne);
  constructor() {
    this.createToastContainer();
  }
  createToastContainer() {
    if (!document.getElementById("toast-container")) {
      let t = document.createElement("div");
      (t.id = "toast-container"),
        (t.className = "toast toast-bottom toast-end z-50"),
        document.body.appendChild(t);
    }
  }
  createToastElement(t, n, r = 5e3, o, i) {
    let s = document.getElementById("toast-container");
    if (!s) return;
    let a = document.createElement("div");
    a.classList.add(
      "alert",
      n,
      "shadow-lg",
      "flex",
      "items-center",
      "gap-3",
      "cursor-pointer"
    ),
      i && a.addEventListener("click", () => this.router.navigateByUrl(i)),
      (a.innerHTML = `
      ${o ? `<img src=${o || "/user.png"} class='w-10 h-10 rounded-full'` : ""}
      <span>${t}</span>
      <button class="ml-4 btn btn-sm btn-ghost">x</button>
    `),
      a.querySelector("button")?.addEventListener("click", () => {
        s.removeChild(a);
      }),
      s.append(a),
      setTimeout(() => {
        s.contains(a) && s.removeChild(a);
      }, r);
  }
  success(t, n, r, o) {
    this.createToastElement(t, "alert-success", n);
  }
  error(t, n, r, o) {
    this.createToastElement(t, "alert-error", n);
  }
  warning(t, n, r, o) {
    this.createToastElement(t, "alert-warning", n);
  }
  info(t, n, r, o) {
    this.createToastElement(t, "alert-info", n, r, o);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Qt = class extends Error {
    constructor(t, n) {
      let r = new.target.prototype;
      super(`${t}: Status code '${n}'`),
        (this.statusCode = n),
        (this.__proto__ = r);
    }
  },
  $r = class extends Error {
    constructor(t = "A timeout occurred.") {
      let n = new.target.prototype;
      super(t), (this.__proto__ = n);
    }
  },
  Je = class extends Error {
    constructor(t = "An abort occurred.") {
      let n = new.target.prototype;
      super(t), (this.__proto__ = n);
    }
  },
  Vu = class extends Error {
    constructor(t, n) {
      let r = new.target.prototype;
      super(t),
        (this.transport = n),
        (this.errorType = "UnsupportedTransportError"),
        (this.__proto__ = r);
    }
  },
  ju = class extends Error {
    constructor(t, n) {
      let r = new.target.prototype;
      super(t),
        (this.transport = n),
        (this.errorType = "DisabledTransportError"),
        (this.__proto__ = r);
    }
  },
  Uu = class extends Error {
    constructor(t, n) {
      let r = new.target.prototype;
      super(t),
        (this.transport = n),
        (this.errorType = "FailedToStartTransportError"),
        (this.__proto__ = r);
    }
  },
  xa = class extends Error {
    constructor(t) {
      let n = new.target.prototype;
      super(t),
        (this.errorType = "FailedToNegotiateWithServerError"),
        (this.__proto__ = n);
    }
  },
  Bu = class extends Error {
    constructor(t, n) {
      let r = new.target.prototype;
      super(t), (this.innerErrors = n), (this.__proto__ = r);
    }
  };
var $i = class {
    constructor(t, n, r) {
      (this.statusCode = t), (this.statusText = n), (this.content = r);
    }
  },
  qn = class {
    get(t, n) {
      return this.send(B(b({}, n), { method: "GET", url: t }));
    }
    post(t, n) {
      return this.send(B(b({}, n), { method: "POST", url: t }));
    }
    delete(t, n) {
      return this.send(B(b({}, n), { method: "DELETE", url: t }));
    }
    getCookieString(t) {
      return "";
    }
  };
var _ = (function (e) {
  return (
    (e[(e.Trace = 0)] = "Trace"),
    (e[(e.Debug = 1)] = "Debug"),
    (e[(e.Information = 2)] = "Information"),
    (e[(e.Warning = 3)] = "Warning"),
    (e[(e.Error = 4)] = "Error"),
    (e[(e.Critical = 5)] = "Critical"),
    (e[(e.None = 6)] = "None"),
    e
  );
})(_ || {});
var Zn = class {
  constructor() {}
  log(t, n) {}
};
Zn.instance = new Zn();
var dC = "9.0.6";
var he = class {
    static isRequired(t, n) {
      if (t == null) throw new Error(`The '${n}' argument is required.`);
    }
    static isNotEmpty(t, n) {
      if (!t || t.match(/^\s*$/))
        throw new Error(`The '${n}' argument should not be empty.`);
    }
    static isIn(t, n, r) {
      if (!(t in n)) throw new Error(`Unknown ${r} value: ${t}.`);
    }
  },
  me = class e {
    static get isBrowser() {
      return (
        !e.isNode &&
        typeof window == "object" &&
        typeof window.document == "object"
      );
    }
    static get isWebWorker() {
      return !e.isNode && typeof self == "object" && "importScripts" in self;
    }
    static get isReactNative() {
      return (
        !e.isNode && typeof window == "object" && typeof window.document > "u"
      );
    }
    static get isNode() {
      return (
        typeof process < "u" &&
        process.release &&
        process.release.name === "node"
      );
    }
  };
function zr(e, t) {
  let n = "";
  return (
    Sn(e)
      ? ((n = `Binary data of length ${e.byteLength}`),
        t && (n += `. Content: '${TN(e)}'`))
      : typeof e == "string" &&
        ((n = `String data of length ${e.length}`),
        t && (n += `. Content: '${e}'`)),
    n
  );
}
function TN(e) {
  let t = new Uint8Array(e),
    n = "";
  return (
    t.forEach((r) => {
      let o = r < 16 ? "0" : "";
      n += `0x${o}${r.toString(16)} `;
    }),
    n.substr(0, n.length - 1)
  );
}
function Sn(e) {
  return (
    e &&
    typeof ArrayBuffer < "u" &&
    (e instanceof ArrayBuffer ||
      (e.constructor && e.constructor.name === "ArrayBuffer"))
  );
}
async function $u(e, t, n, r, o, i) {
  let s = {},
    [a, c] = Yn();
  (s[a] = c),
    e.log(
      _.Trace,
      `(${t} transport) sending data. ${zr(o, i.logMessageContent)}.`
    );
  let l = Sn(o) ? "arraybuffer" : "text",
    u = await n.post(r, {
      content: o,
      headers: b(b({}, s), i.headers),
      responseType: l,
      timeout: i.timeout,
      withCredentials: i.withCredentials,
    });
  e.log(
    _.Trace,
    `(${t} transport) request complete. Response status: ${u.statusCode}.`
  );
}
function fC(e) {
  return e === void 0
    ? new Lo(_.Information)
    : e === null
    ? Zn.instance
    : e.log !== void 0
    ? e
    : new Lo(e);
}
var Hu = class {
    constructor(t, n) {
      (this._subject = t), (this._observer = n);
    }
    dispose() {
      let t = this._subject.observers.indexOf(this._observer);
      t > -1 && this._subject.observers.splice(t, 1),
        this._subject.observers.length === 0 &&
          this._subject.cancelCallback &&
          this._subject.cancelCallback().catch((n) => {});
    }
  },
  Lo = class {
    constructor(t) {
      (this._minLevel = t), (this.out = console);
    }
    log(t, n) {
      if (t >= this._minLevel) {
        let r = `[${new Date().toISOString()}] ${_[t]}: ${n}`;
        switch (t) {
          case _.Critical:
          case _.Error:
            this.out.error(r);
            break;
          case _.Warning:
            this.out.warn(r);
            break;
          case _.Information:
            this.out.info(r);
            break;
          default:
            this.out.log(r);
            break;
        }
      }
    }
  };
function Yn() {
  let e = "X-SignalR-User-Agent";
  return me.isNode && (e = "User-Agent"), [e, xN(dC, NN(), RN(), AN())];
}
function xN(e, t, n, r) {
  let o = "Microsoft SignalR/",
    i = e.split(".");
  return (
    (o += `${i[0]}.${i[1]}`),
    (o += ` (${e}; `),
    t && t !== "" ? (o += `${t}; `) : (o += "Unknown OS; "),
    (o += `${n}`),
    r ? (o += `; ${r}`) : (o += "; Unknown Runtime Version"),
    (o += ")"),
    o
  );
}
function NN() {
  if (me.isNode)
    switch (process.platform) {
      case "win32":
        return "Windows NT";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return process.platform;
    }
  else return "";
}
function AN() {
  if (me.isNode) return process.versions.node;
}
function RN() {
  return me.isNode ? "NodeJS" : "Browser";
}
function zu(e) {
  return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function pC() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof self < "u") return self;
  if (typeof window < "u") return window;
  if (typeof global < "u") return global;
  throw new Error("could not find global");
}
var Gu = class extends qn {
  constructor(t) {
    if ((super(), (this._logger = t), typeof fetch > "u" || me.isNode)) {
      let n =
        typeof __webpack_require__ == "function" ? __non_webpack_require__ : Uo;
      (this._jar = new (n("tough-cookie").CookieJar)()),
        typeof fetch > "u"
          ? (this._fetchType = n("node-fetch"))
          : (this._fetchType = fetch),
        (this._fetchType = n("fetch-cookie")(this._fetchType, this._jar));
    } else this._fetchType = fetch.bind(pC());
    if (typeof AbortController > "u") {
      let n =
        typeof __webpack_require__ == "function" ? __non_webpack_require__ : Uo;
      this._abortControllerType = n("abort-controller");
    } else this._abortControllerType = AbortController;
  }
  async send(t) {
    if (t.abortSignal && t.abortSignal.aborted) throw new Je();
    if (!t.method) throw new Error("No method defined.");
    if (!t.url) throw new Error("No url defined.");
    let n = new this._abortControllerType(),
      r;
    t.abortSignal &&
      (t.abortSignal.onabort = () => {
        n.abort(), (r = new Je());
      });
    let o = null;
    if (t.timeout) {
      let c = t.timeout;
      o = setTimeout(() => {
        n.abort(),
          this._logger.log(_.Warning, "Timeout from HTTP request."),
          (r = new $r());
      }, c);
    }
    t.content === "" && (t.content = void 0),
      t.content &&
        ((t.headers = t.headers || {}),
        Sn(t.content)
          ? (t.headers["Content-Type"] = "application/octet-stream")
          : (t.headers["Content-Type"] = "text/plain;charset=UTF-8"));
    let i;
    try {
      i = await this._fetchType(t.url, {
        body: t.content,
        cache: "no-cache",
        credentials: t.withCredentials === !0 ? "include" : "same-origin",
        headers: b({ "X-Requested-With": "XMLHttpRequest" }, t.headers),
        method: t.method,
        mode: "cors",
        redirect: "follow",
        signal: n.signal,
      });
    } catch (c) {
      throw (
        r || (this._logger.log(_.Warning, `Error from HTTP request. ${c}.`), c)
      );
    } finally {
      o && clearTimeout(o), t.abortSignal && (t.abortSignal.onabort = null);
    }
    if (!i.ok) {
      let c = await hC(i, "text");
      throw new Qt(c || i.statusText, i.status);
    }
    let a = await hC(i, t.responseType);
    return new $i(i.status, i.statusText, a);
  }
  getCookieString(t) {
    let n = "";
    return (
      me.isNode &&
        this._jar &&
        this._jar.getCookies(t, (r, o) => (n = o.join("; "))),
      n
    );
  }
};
function hC(e, t) {
  let n;
  switch (t) {
    case "arraybuffer":
      n = e.arrayBuffer();
      break;
    case "text":
      n = e.text();
      break;
    case "blob":
    case "document":
    case "json":
      throw new Error(`${t} is not supported.`);
    default:
      n = e.text();
      break;
  }
  return n;
}
var Wu = class extends qn {
  constructor(t) {
    super(), (this._logger = t);
  }
  send(t) {
    return t.abortSignal && t.abortSignal.aborted
      ? Promise.reject(new Je())
      : t.method
      ? t.url
        ? new Promise((n, r) => {
            let o = new XMLHttpRequest();
            o.open(t.method, t.url, !0),
              (o.withCredentials =
                t.withCredentials === void 0 ? !0 : t.withCredentials),
              o.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
              t.content === "" && (t.content = void 0),
              t.content &&
                (Sn(t.content)
                  ? o.setRequestHeader(
                      "Content-Type",
                      "application/octet-stream"
                    )
                  : o.setRequestHeader(
                      "Content-Type",
                      "text/plain;charset=UTF-8"
                    ));
            let i = t.headers;
            i &&
              Object.keys(i).forEach((s) => {
                o.setRequestHeader(s, i[s]);
              }),
              t.responseType && (o.responseType = t.responseType),
              t.abortSignal &&
                (t.abortSignal.onabort = () => {
                  o.abort(), r(new Je());
                }),
              t.timeout && (o.timeout = t.timeout),
              (o.onload = () => {
                t.abortSignal && (t.abortSignal.onabort = null),
                  o.status >= 200 && o.status < 300
                    ? n(
                        new $i(
                          o.status,
                          o.statusText,
                          o.response || o.responseText
                        )
                      )
                    : r(
                        new Qt(
                          o.response || o.responseText || o.statusText,
                          o.status
                        )
                      );
              }),
              (o.onerror = () => {
                this._logger.log(
                  _.Warning,
                  `Error from HTTP request. ${o.status}: ${o.statusText}.`
                ),
                  r(new Qt(o.statusText, o.status));
              }),
              (o.ontimeout = () => {
                this._logger.log(_.Warning, "Timeout from HTTP request."),
                  r(new $r());
              }),
              o.send(t.content);
          })
        : Promise.reject(new Error("No url defined."))
      : Promise.reject(new Error("No method defined."));
  }
};
var qu = class extends qn {
  constructor(t) {
    if ((super(), typeof fetch < "u" || me.isNode))
      this._httpClient = new Gu(t);
    else if (typeof XMLHttpRequest < "u") this._httpClient = new Wu(t);
    else throw new Error("No usable HttpClient found.");
  }
  send(t) {
    return t.abortSignal && t.abortSignal.aborted
      ? Promise.reject(new Je())
      : t.method
      ? t.url
        ? this._httpClient.send(t)
        : Promise.reject(new Error("No url defined."))
      : Promise.reject(new Error("No method defined."));
  }
  getCookieString(t) {
    return this._httpClient.getCookieString(t);
  }
};
var Kt = class e {
  static write(t) {
    return `${t}${e.RecordSeparator}`;
  }
  static parse(t) {
    if (t[t.length - 1] !== e.RecordSeparator)
      throw new Error("Message is incomplete.");
    let n = t.split(e.RecordSeparator);
    return n.pop(), n;
  }
};
Kt.RecordSeparatorCode = 30;
Kt.RecordSeparator = String.fromCharCode(Kt.RecordSeparatorCode);
var Zu = class {
  writeHandshakeRequest(t) {
    return Kt.write(JSON.stringify(t));
  }
  parseHandshakeResponse(t) {
    let n, r;
    if (Sn(t)) {
      let a = new Uint8Array(t),
        c = a.indexOf(Kt.RecordSeparatorCode);
      if (c === -1) throw new Error("Message is incomplete.");
      let l = c + 1;
      (n = String.fromCharCode.apply(
        null,
        Array.prototype.slice.call(a.slice(0, l))
      )),
        (r = a.byteLength > l ? a.slice(l).buffer : null);
    } else {
      let a = t,
        c = a.indexOf(Kt.RecordSeparator);
      if (c === -1) throw new Error("Message is incomplete.");
      let l = c + 1;
      (n = a.substring(0, l)), (r = a.length > l ? a.substring(l) : null);
    }
    let o = Kt.parse(n),
      i = JSON.parse(o[0]);
    if (i.type)
      throw new Error("Expected a handshake response from the server.");
    return [r, i];
  }
};
var Q = (function (e) {
  return (
    (e[(e.Invocation = 1)] = "Invocation"),
    (e[(e.StreamItem = 2)] = "StreamItem"),
    (e[(e.Completion = 3)] = "Completion"),
    (e[(e.StreamInvocation = 4)] = "StreamInvocation"),
    (e[(e.CancelInvocation = 5)] = "CancelInvocation"),
    (e[(e.Ping = 6)] = "Ping"),
    (e[(e.Close = 7)] = "Close"),
    (e[(e.Ack = 8)] = "Ack"),
    (e[(e.Sequence = 9)] = "Sequence"),
    e
  );
})(Q || {});
var Yu = class {
  constructor() {
    this.observers = [];
  }
  next(t) {
    for (let n of this.observers) n.next(t);
  }
  error(t) {
    for (let n of this.observers) n.error && n.error(t);
  }
  complete() {
    for (let t of this.observers) t.complete && t.complete();
  }
  subscribe(t) {
    return this.observers.push(t), new Hu(this, t);
  }
};
var Qu = class {
    constructor(t, n, r) {
      (this._bufferSize = 1e5),
        (this._messages = []),
        (this._totalMessageCount = 0),
        (this._waitForSequenceMessage = !1),
        (this._nextReceivingSequenceId = 1),
        (this._latestReceivedSequenceId = 0),
        (this._bufferedByteCount = 0),
        (this._reconnectInProgress = !1),
        (this._protocol = t),
        (this._connection = n),
        (this._bufferSize = r);
    }
    async _send(t) {
      let n = this._protocol.writeMessage(t),
        r = Promise.resolve();
      if (this._isInvocationMessage(t)) {
        this._totalMessageCount++;
        let o = () => {},
          i = () => {};
        Sn(n)
          ? (this._bufferedByteCount += n.byteLength)
          : (this._bufferedByteCount += n.length),
          this._bufferedByteCount >= this._bufferSize &&
            (r = new Promise((s, a) => {
              (o = s), (i = a);
            })),
          this._messages.push(new Qm(n, this._totalMessageCount, o, i));
      }
      try {
        this._reconnectInProgress || (await this._connection.send(n));
      } catch {
        this._disconnected();
      }
      await r;
    }
    _ack(t) {
      let n = -1;
      for (let r = 0; r < this._messages.length; r++) {
        let o = this._messages[r];
        if (o._id <= t.sequenceId)
          (n = r),
            Sn(o._message)
              ? (this._bufferedByteCount -= o._message.byteLength)
              : (this._bufferedByteCount -= o._message.length),
            o._resolver();
        else if (this._bufferedByteCount < this._bufferSize) o._resolver();
        else break;
      }
      n !== -1 && (this._messages = this._messages.slice(n + 1));
    }
    _shouldProcessMessage(t) {
      if (this._waitForSequenceMessage)
        return t.type !== Q.Sequence
          ? !1
          : ((this._waitForSequenceMessage = !1), !0);
      if (!this._isInvocationMessage(t)) return !0;
      let n = this._nextReceivingSequenceId;
      return (
        this._nextReceivingSequenceId++,
        n <= this._latestReceivedSequenceId
          ? (n === this._latestReceivedSequenceId && this._ackTimer(), !1)
          : ((this._latestReceivedSequenceId = n), this._ackTimer(), !0)
      );
    }
    _resetSequence(t) {
      if (t.sequenceId > this._nextReceivingSequenceId) {
        this._connection.stop(
          new Error(
            "Sequence ID greater than amount of messages we've received."
          )
        );
        return;
      }
      this._nextReceivingSequenceId = t.sequenceId;
    }
    _disconnected() {
      (this._reconnectInProgress = !0), (this._waitForSequenceMessage = !0);
    }
    async _resend() {
      let t =
        this._messages.length !== 0
          ? this._messages[0]._id
          : this._totalMessageCount + 1;
      await this._connection.send(
        this._protocol.writeMessage({ type: Q.Sequence, sequenceId: t })
      );
      let n = this._messages;
      for (let r of n) await this._connection.send(r._message);
      this._reconnectInProgress = !1;
    }
    _dispose(t) {
      t ?? (t = new Error("Unable to reconnect to server."));
      for (let n of this._messages) n._rejector(t);
    }
    _isInvocationMessage(t) {
      switch (t.type) {
        case Q.Invocation:
        case Q.StreamItem:
        case Q.Completion:
        case Q.StreamInvocation:
        case Q.CancelInvocation:
          return !0;
        case Q.Close:
        case Q.Sequence:
        case Q.Ping:
        case Q.Ack:
          return !1;
      }
    }
    _ackTimer() {
      this._ackTimerHandle === void 0 &&
        (this._ackTimerHandle = setTimeout(async () => {
          try {
            this._reconnectInProgress ||
              (await this._connection.send(
                this._protocol.writeMessage({
                  type: Q.Ack,
                  sequenceId: this._latestReceivedSequenceId,
                })
              ));
          } catch {}
          clearTimeout(this._ackTimerHandle), (this._ackTimerHandle = void 0);
        }, 1e3));
    }
  },
  Qm = class {
    constructor(t, n, r, o) {
      (this._message = t),
        (this._id = n),
        (this._resolver = r),
        (this._rejector = o);
    }
  };
var kN = 30 * 1e3,
  ON = 15 * 1e3,
  PN = 1e5,
  ce = (function (e) {
    return (
      (e.Disconnected = "Disconnected"),
      (e.Connecting = "Connecting"),
      (e.Connected = "Connected"),
      (e.Disconnecting = "Disconnecting"),
      (e.Reconnecting = "Reconnecting"),
      e
    );
  })(ce || {}),
  Na = class e {
    static create(t, n, r, o, i, s, a) {
      return new e(t, n, r, o, i, s, a);
    }
    constructor(t, n, r, o, i, s, a) {
      (this._nextKeepAlive = 0),
        (this._freezeEventListener = () => {
          this._logger.log(
            _.Warning,
            "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep"
          );
        }),
        he.isRequired(t, "connection"),
        he.isRequired(n, "logger"),
        he.isRequired(r, "protocol"),
        (this.serverTimeoutInMilliseconds = i ?? kN),
        (this.keepAliveIntervalInMilliseconds = s ?? ON),
        (this._statefulReconnectBufferSize = a ?? PN),
        (this._logger = n),
        (this._protocol = r),
        (this.connection = t),
        (this._reconnectPolicy = o),
        (this._handshakeProtocol = new Zu()),
        (this.connection.onreceive = (c) => this._processIncomingData(c)),
        (this.connection.onclose = (c) => this._connectionClosed(c)),
        (this._callbacks = {}),
        (this._methods = {}),
        (this._closedCallbacks = []),
        (this._reconnectingCallbacks = []),
        (this._reconnectedCallbacks = []),
        (this._invocationId = 0),
        (this._receivedHandshakeResponse = !1),
        (this._connectionState = ce.Disconnected),
        (this._connectionStarted = !1),
        (this._cachedPingMessage = this._protocol.writeMessage({
          type: Q.Ping,
        }));
    }
    get state() {
      return this._connectionState;
    }
    get connectionId() {
      return (this.connection && this.connection.connectionId) || null;
    }
    get baseUrl() {
      return this.connection.baseUrl || "";
    }
    set baseUrl(t) {
      if (
        this._connectionState !== ce.Disconnected &&
        this._connectionState !== ce.Reconnecting
      )
        throw new Error(
          "The HubConnection must be in the Disconnected or Reconnecting state to change the url."
        );
      if (!t) throw new Error("The HubConnection url must be a valid url.");
      this.connection.baseUrl = t;
    }
    start() {
      return (
        (this._startPromise = this._startWithStateTransitions()),
        this._startPromise
      );
    }
    async _startWithStateTransitions() {
      if (this._connectionState !== ce.Disconnected)
        return Promise.reject(
          new Error(
            "Cannot start a HubConnection that is not in the 'Disconnected' state."
          )
        );
      (this._connectionState = ce.Connecting),
        this._logger.log(_.Debug, "Starting HubConnection.");
      try {
        await this._startInternal(),
          me.isBrowser &&
            window.document.addEventListener(
              "freeze",
              this._freezeEventListener
            ),
          (this._connectionState = ce.Connected),
          (this._connectionStarted = !0),
          this._logger.log(_.Debug, "HubConnection connected successfully.");
      } catch (t) {
        return (
          (this._connectionState = ce.Disconnected),
          this._logger.log(
            _.Debug,
            `HubConnection failed to start successfully because of error '${t}'.`
          ),
          Promise.reject(t)
        );
      }
    }
    async _startInternal() {
      (this._stopDuringStartError = void 0),
        (this._receivedHandshakeResponse = !1);
      let t = new Promise((n, r) => {
        (this._handshakeResolver = n), (this._handshakeRejecter = r);
      });
      await this.connection.start(this._protocol.transferFormat);
      try {
        let n = this._protocol.version;
        this.connection.features.reconnect || (n = 1);
        let r = { protocol: this._protocol.name, version: n };
        if (
          (this._logger.log(_.Debug, "Sending handshake request."),
          await this._sendMessage(
            this._handshakeProtocol.writeHandshakeRequest(r)
          ),
          this._logger.log(
            _.Information,
            `Using HubProtocol '${this._protocol.name}'.`
          ),
          this._cleanupTimeout(),
          this._resetTimeoutPeriod(),
          this._resetKeepAliveInterval(),
          await t,
          this._stopDuringStartError)
        )
          throw this._stopDuringStartError;
        (this.connection.features.reconnect || !1) &&
          ((this._messageBuffer = new Qu(
            this._protocol,
            this.connection,
            this._statefulReconnectBufferSize
          )),
          (this.connection.features.disconnected =
            this._messageBuffer._disconnected.bind(this._messageBuffer)),
          (this.connection.features.resend = () => {
            if (this._messageBuffer) return this._messageBuffer._resend();
          })),
          this.connection.features.inherentKeepAlive ||
            (await this._sendMessage(this._cachedPingMessage));
      } catch (n) {
        throw (
          (this._logger.log(
            _.Debug,
            `Hub handshake failed with error '${n}' during start(). Stopping HubConnection.`
          ),
          this._cleanupTimeout(),
          this._cleanupPingTimer(),
          await this.connection.stop(n),
          n)
        );
      }
    }
    async stop() {
      let t = this._startPromise;
      (this.connection.features.reconnect = !1),
        (this._stopPromise = this._stopInternal()),
        await this._stopPromise;
      try {
        await t;
      } catch {}
    }
    _stopInternal(t) {
      if (this._connectionState === ce.Disconnected)
        return (
          this._logger.log(
            _.Debug,
            `Call to HubConnection.stop(${t}) ignored because it is already in the disconnected state.`
          ),
          Promise.resolve()
        );
      if (this._connectionState === ce.Disconnecting)
        return (
          this._logger.log(
            _.Debug,
            `Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnecting state.`
          ),
          this._stopPromise
        );
      let n = this._connectionState;
      return (
        (this._connectionState = ce.Disconnecting),
        this._logger.log(_.Debug, "Stopping HubConnection."),
        this._reconnectDelayHandle
          ? (this._logger.log(
              _.Debug,
              "Connection stopped during reconnect delay. Done reconnecting."
            ),
            clearTimeout(this._reconnectDelayHandle),
            (this._reconnectDelayHandle = void 0),
            this._completeClose(),
            Promise.resolve())
          : (n === ce.Connected && this._sendCloseMessage(),
            this._cleanupTimeout(),
            this._cleanupPingTimer(),
            (this._stopDuringStartError =
              t ||
              new Je(
                "The connection was stopped before the hub handshake could complete."
              )),
            this.connection.stop(t))
      );
    }
    async _sendCloseMessage() {
      try {
        await this._sendWithProtocol(this._createCloseMessage());
      } catch {}
    }
    stream(t, ...n) {
      let [r, o] = this._replaceStreamingParams(n),
        i = this._createStreamInvocation(t, n, o),
        s,
        a = new Yu();
      return (
        (a.cancelCallback = () => {
          let c = this._createCancelInvocation(i.invocationId);
          return (
            delete this._callbacks[i.invocationId],
            s.then(() => this._sendWithProtocol(c))
          );
        }),
        (this._callbacks[i.invocationId] = (c, l) => {
          if (l) {
            a.error(l);
            return;
          } else
            c &&
              (c.type === Q.Completion
                ? c.error
                  ? a.error(new Error(c.error))
                  : a.complete()
                : a.next(c.item));
        }),
        (s = this._sendWithProtocol(i).catch((c) => {
          a.error(c), delete this._callbacks[i.invocationId];
        })),
        this._launchStreams(r, s),
        a
      );
    }
    _sendMessage(t) {
      return this._resetKeepAliveInterval(), this.connection.send(t);
    }
    _sendWithProtocol(t) {
      return this._messageBuffer
        ? this._messageBuffer._send(t)
        : this._sendMessage(this._protocol.writeMessage(t));
    }
    send(t, ...n) {
      let [r, o] = this._replaceStreamingParams(n),
        i = this._sendWithProtocol(this._createInvocation(t, n, !0, o));
      return this._launchStreams(r, i), i;
    }
    invoke(t, ...n) {
      let [r, o] = this._replaceStreamingParams(n),
        i = this._createInvocation(t, n, !1, o);
      return new Promise((a, c) => {
        this._callbacks[i.invocationId] = (u, d) => {
          if (d) {
            c(d);
            return;
          } else
            u &&
              (u.type === Q.Completion
                ? u.error
                  ? c(new Error(u.error))
                  : a(u.result)
                : c(new Error(`Unexpected message type: ${u.type}`)));
        };
        let l = this._sendWithProtocol(i).catch((u) => {
          c(u), delete this._callbacks[i.invocationId];
        });
        this._launchStreams(r, l);
      });
    }
    on(t, n) {
      !t ||
        !n ||
        ((t = t.toLowerCase()),
        this._methods[t] || (this._methods[t] = []),
        this._methods[t].indexOf(n) === -1 && this._methods[t].push(n));
    }
    off(t, n) {
      if (!t) return;
      t = t.toLowerCase();
      let r = this._methods[t];
      if (r)
        if (n) {
          let o = r.indexOf(n);
          o !== -1 &&
            (r.splice(o, 1), r.length === 0 && delete this._methods[t]);
        } else delete this._methods[t];
    }
    onclose(t) {
      t && this._closedCallbacks.push(t);
    }
    onreconnecting(t) {
      t && this._reconnectingCallbacks.push(t);
    }
    onreconnected(t) {
      t && this._reconnectedCallbacks.push(t);
    }
    _processIncomingData(t) {
      if (
        (this._cleanupTimeout(),
        this._receivedHandshakeResponse ||
          ((t = this._processHandshakeResponse(t)),
          (this._receivedHandshakeResponse = !0)),
        t)
      ) {
        let n = this._protocol.parseMessages(t, this._logger);
        for (let r of n)
          if (
            !(
              this._messageBuffer &&
              !this._messageBuffer._shouldProcessMessage(r)
            )
          )
            switch (r.type) {
              case Q.Invocation:
                this._invokeClientMethod(r).catch((o) => {
                  this._logger.log(
                    _.Error,
                    `Invoke client method threw error: ${zu(o)}`
                  );
                });
                break;
              case Q.StreamItem:
              case Q.Completion: {
                let o = this._callbacks[r.invocationId];
                if (o) {
                  r.type === Q.Completion &&
                    delete this._callbacks[r.invocationId];
                  try {
                    o(r);
                  } catch (i) {
                    this._logger.log(
                      _.Error,
                      `Stream callback threw error: ${zu(i)}`
                    );
                  }
                }
                break;
              }
              case Q.Ping:
                break;
              case Q.Close: {
                this._logger.log(
                  _.Information,
                  "Close message received from server."
                );
                let o = r.error
                  ? new Error("Server returned an error on close: " + r.error)
                  : void 0;
                r.allowReconnect === !0
                  ? this.connection.stop(o)
                  : (this._stopPromise = this._stopInternal(o));
                break;
              }
              case Q.Ack:
                this._messageBuffer && this._messageBuffer._ack(r);
                break;
              case Q.Sequence:
                this._messageBuffer && this._messageBuffer._resetSequence(r);
                break;
              default:
                this._logger.log(_.Warning, `Invalid message type: ${r.type}.`);
                break;
            }
      }
      this._resetTimeoutPeriod();
    }
    _processHandshakeResponse(t) {
      let n, r;
      try {
        [r, n] = this._handshakeProtocol.parseHandshakeResponse(t);
      } catch (o) {
        let i = "Error parsing handshake response: " + o;
        this._logger.log(_.Error, i);
        let s = new Error(i);
        throw (this._handshakeRejecter(s), s);
      }
      if (n.error) {
        let o = "Server returned handshake error: " + n.error;
        this._logger.log(_.Error, o);
        let i = new Error(o);
        throw (this._handshakeRejecter(i), i);
      } else this._logger.log(_.Debug, "Server handshake complete.");
      return this._handshakeResolver(), r;
    }
    _resetKeepAliveInterval() {
      this.connection.features.inherentKeepAlive ||
        ((this._nextKeepAlive =
          new Date().getTime() + this.keepAliveIntervalInMilliseconds),
        this._cleanupPingTimer());
    }
    _resetTimeoutPeriod() {
      if (
        (!this.connection.features ||
          !this.connection.features.inherentKeepAlive) &&
        ((this._timeoutHandle = setTimeout(
          () => this.serverTimeout(),
          this.serverTimeoutInMilliseconds
        )),
        this._pingServerHandle === void 0)
      ) {
        let t = this._nextKeepAlive - new Date().getTime();
        t < 0 && (t = 0),
          (this._pingServerHandle = setTimeout(async () => {
            if (this._connectionState === ce.Connected)
              try {
                await this._sendMessage(this._cachedPingMessage);
              } catch {
                this._cleanupPingTimer();
              }
          }, t));
      }
    }
    serverTimeout() {
      this.connection.stop(
        new Error(
          "Server timeout elapsed without receiving a message from the server."
        )
      );
    }
    async _invokeClientMethod(t) {
      let n = t.target.toLowerCase(),
        r = this._methods[n];
      if (!r) {
        this._logger.log(
          _.Warning,
          `No client method with the name '${n}' found.`
        ),
          t.invocationId &&
            (this._logger.log(
              _.Warning,
              `No result given for '${n}' method and invocation ID '${t.invocationId}'.`
            ),
            await this._sendWithProtocol(
              this._createCompletionMessage(
                t.invocationId,
                "Client didn't provide a result.",
                null
              )
            ));
        return;
      }
      let o = r.slice(),
        i = !!t.invocationId,
        s,
        a,
        c;
      for (let l of o)
        try {
          let u = s;
          (s = await l.apply(this, t.arguments)),
            i &&
              s &&
              u &&
              (this._logger.log(
                _.Error,
                `Multiple results provided for '${n}'. Sending error to server.`
              ),
              (c = this._createCompletionMessage(
                t.invocationId,
                "Client provided multiple results.",
                null
              ))),
            (a = void 0);
        } catch (u) {
          (a = u),
            this._logger.log(
              _.Error,
              `A callback for the method '${n}' threw error '${u}'.`
            );
        }
      c
        ? await this._sendWithProtocol(c)
        : i
        ? (a
            ? (c = this._createCompletionMessage(t.invocationId, `${a}`, null))
            : s !== void 0
            ? (c = this._createCompletionMessage(t.invocationId, null, s))
            : (this._logger.log(
                _.Warning,
                `No result given for '${n}' method and invocation ID '${t.invocationId}'.`
              ),
              (c = this._createCompletionMessage(
                t.invocationId,
                "Client didn't provide a result.",
                null
              ))),
          await this._sendWithProtocol(c))
        : s &&
          this._logger.log(
            _.Error,
            `Result given for '${n}' method but server is not expecting a result.`
          );
    }
    _connectionClosed(t) {
      this._logger.log(
        _.Debug,
        `HubConnection.connectionClosed(${t}) called while in state ${this._connectionState}.`
      ),
        (this._stopDuringStartError =
          this._stopDuringStartError ||
          t ||
          new Je(
            "The underlying connection was closed before the hub handshake could complete."
          )),
        this._handshakeResolver && this._handshakeResolver(),
        this._cancelCallbacksWithError(
          t ||
            new Error(
              "Invocation canceled due to the underlying connection being closed."
            )
        ),
        this._cleanupTimeout(),
        this._cleanupPingTimer(),
        this._connectionState === ce.Disconnecting
          ? this._completeClose(t)
          : this._connectionState === ce.Connected && this._reconnectPolicy
          ? this._reconnect(t)
          : this._connectionState === ce.Connected && this._completeClose(t);
    }
    _completeClose(t) {
      if (this._connectionStarted) {
        (this._connectionState = ce.Disconnected),
          (this._connectionStarted = !1),
          this._messageBuffer &&
            (this._messageBuffer._dispose(t ?? new Error("Connection closed.")),
            (this._messageBuffer = void 0)),
          me.isBrowser &&
            window.document.removeEventListener(
              "freeze",
              this._freezeEventListener
            );
        try {
          this._closedCallbacks.forEach((n) => n.apply(this, [t]));
        } catch (n) {
          this._logger.log(
            _.Error,
            `An onclose callback called with error '${t}' threw error '${n}'.`
          );
        }
      }
    }
    async _reconnect(t) {
      let n = Date.now(),
        r = 0,
        o =
          t !== void 0
            ? t
            : new Error("Attempting to reconnect due to a unknown error."),
        i = this._getNextRetryDelay(r++, 0, o);
      if (i === null) {
        this._logger.log(
          _.Debug,
          "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."
        ),
          this._completeClose(t);
        return;
      }
      if (
        ((this._connectionState = ce.Reconnecting),
        t
          ? this._logger.log(
              _.Information,
              `Connection reconnecting because of error '${t}'.`
            )
          : this._logger.log(_.Information, "Connection reconnecting."),
        this._reconnectingCallbacks.length !== 0)
      ) {
        try {
          this._reconnectingCallbacks.forEach((s) => s.apply(this, [t]));
        } catch (s) {
          this._logger.log(
            _.Error,
            `An onreconnecting callback called with error '${t}' threw error '${s}'.`
          );
        }
        if (this._connectionState !== ce.Reconnecting) {
          this._logger.log(
            _.Debug,
            "Connection left the reconnecting state in onreconnecting callback. Done reconnecting."
          );
          return;
        }
      }
      for (; i !== null; ) {
        if (
          (this._logger.log(
            _.Information,
            `Reconnect attempt number ${r} will start in ${i} ms.`
          ),
          await new Promise((s) => {
            this._reconnectDelayHandle = setTimeout(s, i);
          }),
          (this._reconnectDelayHandle = void 0),
          this._connectionState !== ce.Reconnecting)
        ) {
          this._logger.log(
            _.Debug,
            "Connection left the reconnecting state during reconnect delay. Done reconnecting."
          );
          return;
        }
        try {
          if (
            (await this._startInternal(),
            (this._connectionState = ce.Connected),
            this._logger.log(
              _.Information,
              "HubConnection reconnected successfully."
            ),
            this._reconnectedCallbacks.length !== 0)
          )
            try {
              this._reconnectedCallbacks.forEach((s) =>
                s.apply(this, [this.connection.connectionId])
              );
            } catch (s) {
              this._logger.log(
                _.Error,
                `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${s}'.`
              );
            }
          return;
        } catch (s) {
          if (
            (this._logger.log(
              _.Information,
              `Reconnect attempt failed because of error '${s}'.`
            ),
            this._connectionState !== ce.Reconnecting)
          ) {
            this._logger.log(
              _.Debug,
              `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`
            ),
              this._connectionState === ce.Disconnecting &&
                this._completeClose();
            return;
          }
          (o = s instanceof Error ? s : new Error(s.toString())),
            (i = this._getNextRetryDelay(r++, Date.now() - n, o));
        }
      }
      this._logger.log(
        _.Information,
        `Reconnect retries have been exhausted after ${
          Date.now() - n
        } ms and ${r} failed attempts. Connection disconnecting.`
      ),
        this._completeClose();
    }
    _getNextRetryDelay(t, n, r) {
      try {
        return this._reconnectPolicy.nextRetryDelayInMilliseconds({
          elapsedMilliseconds: n,
          previousRetryCount: t,
          retryReason: r,
        });
      } catch (o) {
        return (
          this._logger.log(
            _.Error,
            `IRetryPolicy.nextRetryDelayInMilliseconds(${t}, ${n}) threw error '${o}'.`
          ),
          null
        );
      }
    }
    _cancelCallbacksWithError(t) {
      let n = this._callbacks;
      (this._callbacks = {}),
        Object.keys(n).forEach((r) => {
          let o = n[r];
          try {
            o(null, t);
          } catch (i) {
            this._logger.log(
              _.Error,
              `Stream 'error' callback called with '${t}' threw error: ${zu(i)}`
            );
          }
        });
    }
    _cleanupPingTimer() {
      this._pingServerHandle &&
        (clearTimeout(this._pingServerHandle),
        (this._pingServerHandle = void 0));
    }
    _cleanupTimeout() {
      this._timeoutHandle && clearTimeout(this._timeoutHandle);
    }
    _createInvocation(t, n, r, o) {
      if (r)
        return o.length !== 0
          ? { target: t, arguments: n, streamIds: o, type: Q.Invocation }
          : { target: t, arguments: n, type: Q.Invocation };
      {
        let i = this._invocationId;
        return (
          this._invocationId++,
          o.length !== 0
            ? {
                target: t,
                arguments: n,
                invocationId: i.toString(),
                streamIds: o,
                type: Q.Invocation,
              }
            : {
                target: t,
                arguments: n,
                invocationId: i.toString(),
                type: Q.Invocation,
              }
        );
      }
    }
    _launchStreams(t, n) {
      if (t.length !== 0) {
        n || (n = Promise.resolve());
        for (let r in t)
          t[r].subscribe({
            complete: () => {
              n = n.then(() =>
                this._sendWithProtocol(this._createCompletionMessage(r))
              );
            },
            error: (o) => {
              let i;
              o instanceof Error
                ? (i = o.message)
                : o && o.toString
                ? (i = o.toString())
                : (i = "Unknown error"),
                (n = n.then(() =>
                  this._sendWithProtocol(this._createCompletionMessage(r, i))
                ));
            },
            next: (o) => {
              n = n.then(() =>
                this._sendWithProtocol(this._createStreamItemMessage(r, o))
              );
            },
          });
      }
    }
    _replaceStreamingParams(t) {
      let n = [],
        r = [];
      for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (this._isObservable(i)) {
          let s = this._invocationId;
          this._invocationId++,
            (n[s] = i),
            r.push(s.toString()),
            t.splice(o, 1);
        }
      }
      return [n, r];
    }
    _isObservable(t) {
      return t && t.subscribe && typeof t.subscribe == "function";
    }
    _createStreamInvocation(t, n, r) {
      let o = this._invocationId;
      return (
        this._invocationId++,
        r.length !== 0
          ? {
              target: t,
              arguments: n,
              invocationId: o.toString(),
              streamIds: r,
              type: Q.StreamInvocation,
            }
          : {
              target: t,
              arguments: n,
              invocationId: o.toString(),
              type: Q.StreamInvocation,
            }
      );
    }
    _createCancelInvocation(t) {
      return { invocationId: t, type: Q.CancelInvocation };
    }
    _createStreamItemMessage(t, n) {
      return { invocationId: t, item: n, type: Q.StreamItem };
    }
    _createCompletionMessage(t, n, r) {
      return n
        ? { error: n, invocationId: t, type: Q.Completion }
        : { invocationId: t, result: r, type: Q.Completion };
    }
    _createCloseMessage() {
      return { type: Q.Close };
    }
  };
var FN = [0, 2e3, 1e4, 3e4, null],
  Aa = class {
    constructor(t) {
      this._retryDelays = t !== void 0 ? [...t, null] : FN;
    }
    nextRetryDelayInMilliseconds(t) {
      return this._retryDelays[t.previousRetryCount];
    }
  };
var Vo = (() => {
  class e {}
  return (e.Authorization = "Authorization"), (e.Cookie = "Cookie"), e;
})();
var Ku = class extends qn {
  constructor(t, n) {
    super(), (this._innerClient = t), (this._accessTokenFactory = n);
  }
  async send(t) {
    let n = !0;
    this._accessTokenFactory &&
      (!this._accessToken || (t.url && t.url.indexOf("/negotiate?") > 0)) &&
      ((n = !1), (this._accessToken = await this._accessTokenFactory())),
      this._setAuthorizationHeader(t);
    let r = await this._innerClient.send(t);
    return n && r.statusCode === 401 && this._accessTokenFactory
      ? ((this._accessToken = await this._accessTokenFactory()),
        this._setAuthorizationHeader(t),
        await this._innerClient.send(t))
      : r;
  }
  _setAuthorizationHeader(t) {
    t.headers || (t.headers = {}),
      this._accessToken
        ? (t.headers[Vo.Authorization] = `Bearer ${this._accessToken}`)
        : this._accessTokenFactory &&
          t.headers[Vo.Authorization] &&
          delete t.headers[Vo.Authorization];
  }
  getCookieString(t) {
    return this._innerClient.getCookieString(t);
  }
};
var Ge = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.WebSockets = 1)] = "WebSockets"),
      (e[(e.ServerSentEvents = 2)] = "ServerSentEvents"),
      (e[(e.LongPolling = 4)] = "LongPolling"),
      e
    );
  })(Ge || {}),
  Be = (function (e) {
    return (e[(e.Text = 1)] = "Text"), (e[(e.Binary = 2)] = "Binary"), e;
  })(Be || {});
var Ju = class {
  constructor() {
    (this._isAborted = !1), (this.onabort = null);
  }
  abort() {
    this._isAborted || ((this._isAborted = !0), this.onabort && this.onabort());
  }
  get signal() {
    return this;
  }
  get aborted() {
    return this._isAborted;
  }
};
var Ra = class {
  get pollAborted() {
    return this._pollAbort.aborted;
  }
  constructor(t, n, r) {
    (this._httpClient = t),
      (this._logger = n),
      (this._pollAbort = new Ju()),
      (this._options = r),
      (this._running = !1),
      (this.onreceive = null),
      (this.onclose = null);
  }
  async connect(t, n) {
    if (
      (he.isRequired(t, "url"),
      he.isRequired(n, "transferFormat"),
      he.isIn(n, Be, "transferFormat"),
      (this._url = t),
      this._logger.log(_.Trace, "(LongPolling transport) Connecting."),
      n === Be.Binary &&
        typeof XMLHttpRequest < "u" &&
        typeof new XMLHttpRequest().responseType != "string")
    )
      throw new Error(
        "Binary protocols over XmlHttpRequest not implementing advanced features are not supported."
      );
    let [r, o] = Yn(),
      i = b({ [r]: o }, this._options.headers),
      s = {
        abortSignal: this._pollAbort.signal,
        headers: i,
        timeout: 1e5,
        withCredentials: this._options.withCredentials,
      };
    n === Be.Binary && (s.responseType = "arraybuffer");
    let a = `${t}&_=${Date.now()}`;
    this._logger.log(_.Trace, `(LongPolling transport) polling: ${a}.`);
    let c = await this._httpClient.get(a, s);
    c.statusCode !== 200
      ? (this._logger.log(
          _.Error,
          `(LongPolling transport) Unexpected response code: ${c.statusCode}.`
        ),
        (this._closeError = new Qt(c.statusText || "", c.statusCode)),
        (this._running = !1))
      : (this._running = !0),
      (this._receiving = this._poll(this._url, s));
  }
  async _poll(t, n) {
    try {
      for (; this._running; )
        try {
          let r = `${t}&_=${Date.now()}`;
          this._logger.log(_.Trace, `(LongPolling transport) polling: ${r}.`);
          let o = await this._httpClient.get(r, n);
          o.statusCode === 204
            ? (this._logger.log(
                _.Information,
                "(LongPolling transport) Poll terminated by server."
              ),
              (this._running = !1))
            : o.statusCode !== 200
            ? (this._logger.log(
                _.Error,
                `(LongPolling transport) Unexpected response code: ${o.statusCode}.`
              ),
              (this._closeError = new Qt(o.statusText || "", o.statusCode)),
              (this._running = !1))
            : o.content
            ? (this._logger.log(
                _.Trace,
                `(LongPolling transport) data received. ${zr(
                  o.content,
                  this._options.logMessageContent
                )}.`
              ),
              this.onreceive && this.onreceive(o.content))
            : this._logger.log(
                _.Trace,
                "(LongPolling transport) Poll timed out, reissuing."
              );
        } catch (r) {
          this._running
            ? r instanceof $r
              ? this._logger.log(
                  _.Trace,
                  "(LongPolling transport) Poll timed out, reissuing."
                )
              : ((this._closeError = r), (this._running = !1))
            : this._logger.log(
                _.Trace,
                `(LongPolling transport) Poll errored after shutdown: ${r.message}`
              );
        }
    } finally {
      this._logger.log(_.Trace, "(LongPolling transport) Polling complete."),
        this.pollAborted || this._raiseOnClose();
    }
  }
  async send(t) {
    return this._running
      ? $u(
          this._logger,
          "LongPolling",
          this._httpClient,
          this._url,
          t,
          this._options
        )
      : Promise.reject(
          new Error("Cannot send until the transport is connected")
        );
  }
  async stop() {
    this._logger.log(_.Trace, "(LongPolling transport) Stopping polling."),
      (this._running = !1),
      this._pollAbort.abort();
    try {
      await this._receiving,
        this._logger.log(
          _.Trace,
          `(LongPolling transport) sending DELETE request to ${this._url}.`
        );
      let t = {},
        [n, r] = Yn();
      t[n] = r;
      let o = {
          headers: b(b({}, t), this._options.headers),
          timeout: this._options.timeout,
          withCredentials: this._options.withCredentials,
        },
        i;
      try {
        await this._httpClient.delete(this._url, o);
      } catch (s) {
        i = s;
      }
      i
        ? i instanceof Qt &&
          (i.statusCode === 404
            ? this._logger.log(
                _.Trace,
                "(LongPolling transport) A 404 response was returned from sending a DELETE request."
              )
            : this._logger.log(
                _.Trace,
                `(LongPolling transport) Error sending a DELETE request: ${i}`
              ))
        : this._logger.log(
            _.Trace,
            "(LongPolling transport) DELETE request accepted."
          );
    } finally {
      this._logger.log(_.Trace, "(LongPolling transport) Stop finished."),
        this._raiseOnClose();
    }
  }
  _raiseOnClose() {
    if (this.onclose) {
      let t = "(LongPolling transport) Firing onclose event.";
      this._closeError && (t += " Error: " + this._closeError),
        this._logger.log(_.Trace, t),
        this.onclose(this._closeError);
    }
  }
};
var Xu = class {
  constructor(t, n, r, o) {
    (this._httpClient = t),
      (this._accessToken = n),
      (this._logger = r),
      (this._options = o),
      (this.onreceive = null),
      (this.onclose = null);
  }
  async connect(t, n) {
    return (
      he.isRequired(t, "url"),
      he.isRequired(n, "transferFormat"),
      he.isIn(n, Be, "transferFormat"),
      this._logger.log(_.Trace, "(SSE transport) Connecting."),
      (this._url = t),
      this._accessToken &&
        (t +=
          (t.indexOf("?") < 0 ? "?" : "&") +
          `access_token=${encodeURIComponent(this._accessToken)}`),
      new Promise((r, o) => {
        let i = !1;
        if (n !== Be.Text) {
          o(
            new Error(
              "The Server-Sent Events transport only supports the 'Text' transfer format"
            )
          );
          return;
        }
        let s;
        if (me.isBrowser || me.isWebWorker)
          s = new this._options.EventSource(t, {
            withCredentials: this._options.withCredentials,
          });
        else {
          let a = this._httpClient.getCookieString(t),
            c = {};
          c.Cookie = a;
          let [l, u] = Yn();
          (c[l] = u),
            (s = new this._options.EventSource(t, {
              withCredentials: this._options.withCredentials,
              headers: b(b({}, c), this._options.headers),
            }));
        }
        try {
          (s.onmessage = (a) => {
            if (this.onreceive)
              try {
                this._logger.log(
                  _.Trace,
                  `(SSE transport) data received. ${zr(
                    a.data,
                    this._options.logMessageContent
                  )}.`
                ),
                  this.onreceive(a.data);
              } catch (c) {
                this._close(c);
                return;
              }
          }),
            (s.onerror = (a) => {
              i
                ? this._close()
                : o(
                    new Error(
                      "EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."
                    )
                  );
            }),
            (s.onopen = () => {
              this._logger.log(_.Information, `SSE connected to ${this._url}`),
                (this._eventSource = s),
                (i = !0),
                r();
            });
        } catch (a) {
          o(a);
          return;
        }
      })
    );
  }
  async send(t) {
    return this._eventSource
      ? $u(this._logger, "SSE", this._httpClient, this._url, t, this._options)
      : Promise.reject(
          new Error("Cannot send until the transport is connected")
        );
  }
  stop() {
    return this._close(), Promise.resolve();
  }
  _close(t) {
    this._eventSource &&
      (this._eventSource.close(),
      (this._eventSource = void 0),
      this.onclose && this.onclose(t));
  }
};
var ed = class {
  constructor(t, n, r, o, i, s) {
    (this._logger = r),
      (this._accessTokenFactory = n),
      (this._logMessageContent = o),
      (this._webSocketConstructor = i),
      (this._httpClient = t),
      (this.onreceive = null),
      (this.onclose = null),
      (this._headers = s);
  }
  async connect(t, n) {
    he.isRequired(t, "url"),
      he.isRequired(n, "transferFormat"),
      he.isIn(n, Be, "transferFormat"),
      this._logger.log(_.Trace, "(WebSockets transport) Connecting.");
    let r;
    return (
      this._accessTokenFactory && (r = await this._accessTokenFactory()),
      new Promise((o, i) => {
        t = t.replace(/^http/, "ws");
        let s,
          a = this._httpClient.getCookieString(t),
          c = !1;
        if (me.isNode || me.isReactNative) {
          let l = {},
            [u, d] = Yn();
          (l[u] = d),
            r && (l[Vo.Authorization] = `Bearer ${r}`),
            a && (l[Vo.Cookie] = a),
            (s = new this._webSocketConstructor(t, void 0, {
              headers: b(b({}, l), this._headers),
            }));
        } else
          r &&
            (t +=
              (t.indexOf("?") < 0 ? "?" : "&") +
              `access_token=${encodeURIComponent(r)}`);
        s || (s = new this._webSocketConstructor(t)),
          n === Be.Binary && (s.binaryType = "arraybuffer"),
          (s.onopen = (l) => {
            this._logger.log(_.Information, `WebSocket connected to ${t}.`),
              (this._webSocket = s),
              (c = !0),
              o();
          }),
          (s.onerror = (l) => {
            let u = null;
            typeof ErrorEvent < "u" && l instanceof ErrorEvent
              ? (u = l.error)
              : (u = "There was an error with the transport"),
              this._logger.log(_.Information, `(WebSockets transport) ${u}.`);
          }),
          (s.onmessage = (l) => {
            if (
              (this._logger.log(
                _.Trace,
                `(WebSockets transport) data received. ${zr(
                  l.data,
                  this._logMessageContent
                )}.`
              ),
              this.onreceive)
            )
              try {
                this.onreceive(l.data);
              } catch (u) {
                this._close(u);
                return;
              }
          }),
          (s.onclose = (l) => {
            if (c) this._close(l);
            else {
              let u = null;
              typeof ErrorEvent < "u" && l instanceof ErrorEvent
                ? (u = l.error)
                : (u =
                    "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled."),
                i(new Error(u));
            }
          });
      })
    );
  }
  send(t) {
    return this._webSocket &&
      this._webSocket.readyState === this._webSocketConstructor.OPEN
      ? (this._logger.log(
          _.Trace,
          `(WebSockets transport) sending data. ${zr(
            t,
            this._logMessageContent
          )}.`
        ),
        this._webSocket.send(t),
        Promise.resolve())
      : Promise.reject("WebSocket is not in the OPEN state");
  }
  stop() {
    return this._webSocket && this._close(void 0), Promise.resolve();
  }
  _close(t) {
    this._webSocket &&
      ((this._webSocket.onclose = () => {}),
      (this._webSocket.onmessage = () => {}),
      (this._webSocket.onerror = () => {}),
      this._webSocket.close(),
      (this._webSocket = void 0)),
      this._logger.log(_.Trace, "(WebSockets transport) socket closed."),
      this.onclose &&
        (this._isCloseEvent(t) && (t.wasClean === !1 || t.code !== 1e3)
          ? this.onclose(
              new Error(
                `WebSocket closed with status code: ${t.code} (${
                  t.reason || "no reason given"
                }).`
              )
            )
          : t instanceof Error
          ? this.onclose(t)
          : this.onclose());
  }
  _isCloseEvent(t) {
    return t && typeof t.wasClean == "boolean" && typeof t.code == "number";
  }
};
var mC = 100,
  td = class {
    constructor(t, n = {}) {
      if (
        ((this._stopPromiseResolver = () => {}),
        (this.features = {}),
        (this._negotiateVersion = 1),
        he.isRequired(t, "url"),
        (this._logger = fC(n.logger)),
        (this.baseUrl = this._resolveUrl(t)),
        (n = n || {}),
        (n.logMessageContent =
          n.logMessageContent === void 0 ? !1 : n.logMessageContent),
        typeof n.withCredentials == "boolean" || n.withCredentials === void 0)
      )
        n.withCredentials =
          n.withCredentials === void 0 ? !0 : n.withCredentials;
      else
        throw new Error(
          "withCredentials option was not a 'boolean' or 'undefined' value"
        );
      n.timeout = n.timeout === void 0 ? 100 * 1e3 : n.timeout;
      let r = null,
        o = null;
      if (me.isNode && typeof Uo < "u") {
        let i =
          typeof __webpack_require__ == "function"
            ? __non_webpack_require__
            : Uo;
        (r = i("ws")), (o = i("eventsource"));
      }
      !me.isNode && typeof WebSocket < "u" && !n.WebSocket
        ? (n.WebSocket = WebSocket)
        : me.isNode && !n.WebSocket && r && (n.WebSocket = r),
        !me.isNode && typeof EventSource < "u" && !n.EventSource
          ? (n.EventSource = EventSource)
          : me.isNode &&
            !n.EventSource &&
            typeof o < "u" &&
            (n.EventSource = o),
        (this._httpClient = new Ku(
          n.httpClient || new qu(this._logger),
          n.accessTokenFactory
        )),
        (this._connectionState = "Disconnected"),
        (this._connectionStarted = !1),
        (this._options = n),
        (this.onreceive = null),
        (this.onclose = null);
    }
    async start(t) {
      if (
        ((t = t || Be.Binary),
        he.isIn(t, Be, "transferFormat"),
        this._logger.log(
          _.Debug,
          `Starting connection with transfer format '${Be[t]}'.`
        ),
        this._connectionState !== "Disconnected")
      )
        return Promise.reject(
          new Error(
            "Cannot start an HttpConnection that is not in the 'Disconnected' state."
          )
        );
      if (
        ((this._connectionState = "Connecting"),
        (this._startInternalPromise = this._startInternal(t)),
        await this._startInternalPromise,
        this._connectionState === "Disconnecting")
      ) {
        let n = "Failed to start the HttpConnection before stop() was called.";
        return (
          this._logger.log(_.Error, n),
          await this._stopPromise,
          Promise.reject(new Je(n))
        );
      } else if (this._connectionState !== "Connected") {
        let n =
          "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
        return this._logger.log(_.Error, n), Promise.reject(new Je(n));
      }
      this._connectionStarted = !0;
    }
    send(t) {
      return this._connectionState !== "Connected"
        ? Promise.reject(
            new Error(
              "Cannot send data if the connection is not in the 'Connected' State."
            )
          )
        : (this._sendQueue || (this._sendQueue = new Km(this.transport)),
          this._sendQueue.send(t));
    }
    async stop(t) {
      if (this._connectionState === "Disconnected")
        return (
          this._logger.log(
            _.Debug,
            `Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnected state.`
          ),
          Promise.resolve()
        );
      if (this._connectionState === "Disconnecting")
        return (
          this._logger.log(
            _.Debug,
            `Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnecting state.`
          ),
          this._stopPromise
        );
      (this._connectionState = "Disconnecting"),
        (this._stopPromise = new Promise((n) => {
          this._stopPromiseResolver = n;
        })),
        await this._stopInternal(t),
        await this._stopPromise;
    }
    async _stopInternal(t) {
      this._stopError = t;
      try {
        await this._startInternalPromise;
      } catch {}
      if (this.transport) {
        try {
          await this.transport.stop();
        } catch (n) {
          this._logger.log(
            _.Error,
            `HttpConnection.transport.stop() threw error '${n}'.`
          ),
            this._stopConnection();
        }
        this.transport = void 0;
      } else
        this._logger.log(
          _.Debug,
          "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed."
        );
    }
    async _startInternal(t) {
      let n = this.baseUrl;
      (this._accessTokenFactory = this._options.accessTokenFactory),
        (this._httpClient._accessTokenFactory = this._accessTokenFactory);
      try {
        if (this._options.skipNegotiation)
          if (this._options.transport === Ge.WebSockets)
            (this.transport = this._constructTransport(Ge.WebSockets)),
              await this._startTransport(n, t);
          else
            throw new Error(
              "Negotiation can only be skipped when using the WebSocket transport directly."
            );
        else {
          let r = null,
            o = 0;
          do {
            if (
              ((r = await this._getNegotiationResponse(n)),
              this._connectionState === "Disconnecting" ||
                this._connectionState === "Disconnected")
            )
              throw new Je("The connection was stopped during negotiation.");
            if (r.error) throw new Error(r.error);
            if (r.ProtocolVersion)
              throw new Error(
                "Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details."
              );
            if ((r.url && (n = r.url), r.accessToken)) {
              let i = r.accessToken;
              (this._accessTokenFactory = () => i),
                (this._httpClient._accessToken = i),
                (this._httpClient._accessTokenFactory = void 0);
            }
            o++;
          } while (r.url && o < mC);
          if (o === mC && r.url)
            throw new Error("Negotiate redirection limit exceeded.");
          await this._createTransport(n, this._options.transport, r, t);
        }
        this.transport instanceof Ra && (this.features.inherentKeepAlive = !0),
          this._connectionState === "Connecting" &&
            (this._logger.log(
              _.Debug,
              "The HttpConnection connected successfully."
            ),
            (this._connectionState = "Connected"));
      } catch (r) {
        return (
          this._logger.log(_.Error, "Failed to start the connection: " + r),
          (this._connectionState = "Disconnected"),
          (this.transport = void 0),
          this._stopPromiseResolver(),
          Promise.reject(r)
        );
      }
    }
    async _getNegotiationResponse(t) {
      let n = {},
        [r, o] = Yn();
      n[r] = o;
      let i = this._resolveNegotiateUrl(t);
      this._logger.log(_.Debug, `Sending negotiation request: ${i}.`);
      try {
        let s = await this._httpClient.post(i, {
          content: "",
          headers: b(b({}, n), this._options.headers),
          timeout: this._options.timeout,
          withCredentials: this._options.withCredentials,
        });
        if (s.statusCode !== 200)
          return Promise.reject(
            new Error(
              `Unexpected status code returned from negotiate '${s.statusCode}'`
            )
          );
        let a = JSON.parse(s.content);
        return (
          (!a.negotiateVersion || a.negotiateVersion < 1) &&
            (a.connectionToken = a.connectionId),
          a.useStatefulReconnect && this._options._useStatefulReconnect !== !0
            ? Promise.reject(
                new xa(
                  "Client didn't negotiate Stateful Reconnect but the server did."
                )
              )
            : a
        );
      } catch (s) {
        let a = "Failed to complete negotiation with the server: " + s;
        return (
          s instanceof Qt &&
            s.statusCode === 404 &&
            (a =
              a +
              " Either this is not a SignalR endpoint or there is a proxy blocking the connection."),
          this._logger.log(_.Error, a),
          Promise.reject(new xa(a))
        );
      }
    }
    _createConnectUrl(t, n) {
      return n ? t + (t.indexOf("?") === -1 ? "?" : "&") + `id=${n}` : t;
    }
    async _createTransport(t, n, r, o) {
      let i = this._createConnectUrl(t, r.connectionToken);
      if (this._isITransport(n)) {
        this._logger.log(
          _.Debug,
          "Connection was provided an instance of ITransport, using that directly."
        ),
          (this.transport = n),
          await this._startTransport(i, o),
          (this.connectionId = r.connectionId);
        return;
      }
      let s = [],
        a = r.availableTransports || [],
        c = r;
      for (let l of a) {
        let u = this._resolveTransportOrError(
          l,
          n,
          o,
          c?.useStatefulReconnect === !0
        );
        if (u instanceof Error) s.push(`${l.transport} failed:`), s.push(u);
        else if (this._isITransport(u)) {
          if (((this.transport = u), !c)) {
            try {
              c = await this._getNegotiationResponse(t);
            } catch (d) {
              return Promise.reject(d);
            }
            i = this._createConnectUrl(t, c.connectionToken);
          }
          try {
            await this._startTransport(i, o),
              (this.connectionId = c.connectionId);
            return;
          } catch (d) {
            if (
              (this._logger.log(
                _.Error,
                `Failed to start the transport '${l.transport}': ${d}`
              ),
              (c = void 0),
              s.push(new Uu(`${l.transport} failed: ${d}`, Ge[l.transport])),
              this._connectionState !== "Connecting")
            ) {
              let g = "Failed to select transport before stop() was called.";
              return this._logger.log(_.Debug, g), Promise.reject(new Je(g));
            }
          }
        }
      }
      return s.length > 0
        ? Promise.reject(
            new Bu(
              `Unable to connect to the server with any of the available transports. ${s.join(
                " "
              )}`,
              s
            )
          )
        : Promise.reject(
            new Error(
              "None of the transports supported by the client are supported by the server."
            )
          );
    }
    _constructTransport(t) {
      switch (t) {
        case Ge.WebSockets:
          if (!this._options.WebSocket)
            throw new Error(
              "'WebSocket' is not supported in your environment."
            );
          return new ed(
            this._httpClient,
            this._accessTokenFactory,
            this._logger,
            this._options.logMessageContent,
            this._options.WebSocket,
            this._options.headers || {}
          );
        case Ge.ServerSentEvents:
          if (!this._options.EventSource)
            throw new Error(
              "'EventSource' is not supported in your environment."
            );
          return new Xu(
            this._httpClient,
            this._httpClient._accessToken,
            this._logger,
            this._options
          );
        case Ge.LongPolling:
          return new Ra(this._httpClient, this._logger, this._options);
        default:
          throw new Error(`Unknown transport: ${t}.`);
      }
    }
    _startTransport(t, n) {
      return (
        (this.transport.onreceive = this.onreceive),
        this.features.reconnect
          ? (this.transport.onclose = async (r) => {
              let o = !1;
              if (this.features.reconnect)
                try {
                  this.features.disconnected(),
                    await this.transport.connect(t, n),
                    await this.features.resend();
                } catch {
                  o = !0;
                }
              else {
                this._stopConnection(r);
                return;
              }
              o && this._stopConnection(r);
            })
          : (this.transport.onclose = (r) => this._stopConnection(r)),
        this.transport.connect(t, n)
      );
    }
    _resolveTransportOrError(t, n, r, o) {
      let i = Ge[t.transport];
      if (i == null)
        return (
          this._logger.log(
            _.Debug,
            `Skipping transport '${t.transport}' because it is not supported by this client.`
          ),
          new Error(
            `Skipping transport '${t.transport}' because it is not supported by this client.`
          )
        );
      if (LN(n, i))
        if (t.transferFormats.map((a) => Be[a]).indexOf(r) >= 0) {
          if (
            (i === Ge.WebSockets && !this._options.WebSocket) ||
            (i === Ge.ServerSentEvents && !this._options.EventSource)
          )
            return (
              this._logger.log(
                _.Debug,
                `Skipping transport '${Ge[i]}' because it is not supported in your environment.'`
              ),
              new Vu(`'${Ge[i]}' is not supported in your environment.`, i)
            );
          this._logger.log(_.Debug, `Selecting transport '${Ge[i]}'.`);
          try {
            return (
              (this.features.reconnect = i === Ge.WebSockets ? o : void 0),
              this._constructTransport(i)
            );
          } catch (a) {
            return a;
          }
        } else
          return (
            this._logger.log(
              _.Debug,
              `Skipping transport '${Ge[i]}' because it does not support the requested transfer format '${Be[r]}'.`
            ),
            new Error(`'${Ge[i]}' does not support ${Be[r]}.`)
          );
      else
        return (
          this._logger.log(
            _.Debug,
            `Skipping transport '${Ge[i]}' because it was disabled by the client.`
          ),
          new ju(`'${Ge[i]}' is disabled by the client.`, i)
        );
    }
    _isITransport(t) {
      return t && typeof t == "object" && "connect" in t;
    }
    _stopConnection(t) {
      if (
        (this._logger.log(
          _.Debug,
          `HttpConnection.stopConnection(${t}) called while in state ${this._connectionState}.`
        ),
        (this.transport = void 0),
        (t = this._stopError || t),
        (this._stopError = void 0),
        this._connectionState === "Disconnected")
      ) {
        this._logger.log(
          _.Debug,
          `Call to HttpConnection.stopConnection(${t}) was ignored because the connection is already in the disconnected state.`
        );
        return;
      }
      if (this._connectionState === "Connecting")
        throw (
          (this._logger.log(
            _.Warning,
            `Call to HttpConnection.stopConnection(${t}) was ignored because the connection is still in the connecting state.`
          ),
          new Error(
            `HttpConnection.stopConnection(${t}) was called while the connection is still in the connecting state.`
          ))
        );
      if (
        (this._connectionState === "Disconnecting" &&
          this._stopPromiseResolver(),
        t
          ? this._logger.log(
              _.Error,
              `Connection disconnected with error '${t}'.`
            )
          : this._logger.log(_.Information, "Connection disconnected."),
        this._sendQueue &&
          (this._sendQueue.stop().catch((n) => {
            this._logger.log(
              _.Error,
              `TransportSendQueue.stop() threw error '${n}'.`
            );
          }),
          (this._sendQueue = void 0)),
        (this.connectionId = void 0),
        (this._connectionState = "Disconnected"),
        this._connectionStarted)
      ) {
        this._connectionStarted = !1;
        try {
          this.onclose && this.onclose(t);
        } catch (n) {
          this._logger.log(
            _.Error,
            `HttpConnection.onclose(${t}) threw error '${n}'.`
          );
        }
      }
    }
    _resolveUrl(t) {
      if (
        t.lastIndexOf("https://", 0) === 0 ||
        t.lastIndexOf("http://", 0) === 0
      )
        return t;
      if (!me.isBrowser) throw new Error(`Cannot resolve '${t}'.`);
      let n = window.document.createElement("a");
      return (
        (n.href = t),
        this._logger.log(_.Information, `Normalizing '${t}' to '${n.href}'.`),
        n.href
      );
    }
    _resolveNegotiateUrl(t) {
      let n = new URL(t);
      n.pathname.endsWith("/")
        ? (n.pathname += "negotiate")
        : (n.pathname += "/negotiate");
      let r = new URLSearchParams(n.searchParams);
      return (
        r.has("negotiateVersion") ||
          r.append("negotiateVersion", this._negotiateVersion.toString()),
        r.has("useStatefulReconnect")
          ? r.get("useStatefulReconnect") === "true" &&
            (this._options._useStatefulReconnect = !0)
          : this._options._useStatefulReconnect === !0 &&
            r.append("useStatefulReconnect", "true"),
        (n.search = r.toString()),
        n.toString()
      );
    }
  };
function LN(e, t) {
  return !e || (t & e) !== 0;
}
var Km = class e {
    constructor(t) {
      (this._transport = t),
        (this._buffer = []),
        (this._executing = !0),
        (this._sendBufferedData = new zi()),
        (this._transportResult = new zi()),
        (this._sendLoopPromise = this._sendLoop());
    }
    send(t) {
      return (
        this._bufferData(t),
        this._transportResult || (this._transportResult = new zi()),
        this._transportResult.promise
      );
    }
    stop() {
      return (
        (this._executing = !1),
        this._sendBufferedData.resolve(),
        this._sendLoopPromise
      );
    }
    _bufferData(t) {
      if (this._buffer.length && typeof this._buffer[0] != typeof t)
        throw new Error(
          `Expected data to be of type ${typeof this
            ._buffer} but was of type ${typeof t}`
        );
      this._buffer.push(t), this._sendBufferedData.resolve();
    }
    async _sendLoop() {
      for (;;) {
        if ((await this._sendBufferedData.promise, !this._executing)) {
          this._transportResult &&
            this._transportResult.reject("Connection stopped.");
          break;
        }
        this._sendBufferedData = new zi();
        let t = this._transportResult;
        this._transportResult = void 0;
        let n =
          typeof this._buffer[0] == "string"
            ? this._buffer.join("")
            : e._concatBuffers(this._buffer);
        this._buffer.length = 0;
        try {
          await this._transport.send(n), t.resolve();
        } catch (r) {
          t.reject(r);
        }
      }
    }
    static _concatBuffers(t) {
      let n = t.map((i) => i.byteLength).reduce((i, s) => i + s),
        r = new Uint8Array(n),
        o = 0;
      for (let i of t) r.set(new Uint8Array(i), o), (o += i.byteLength);
      return r.buffer;
    }
  },
  zi = class {
    constructor() {
      this.promise = new Promise(
        (t, n) => ([this._resolver, this._rejecter] = [t, n])
      );
    }
    resolve() {
      this._resolver();
    }
    reject(t) {
      this._rejecter(t);
    }
  };
var VN = "json",
  nd = class {
    constructor() {
      (this.name = VN), (this.version = 2), (this.transferFormat = Be.Text);
    }
    parseMessages(t, n) {
      if (typeof t != "string")
        throw new Error(
          "Invalid input for JSON hub protocol. Expected a string."
        );
      if (!t) return [];
      n === null && (n = Zn.instance);
      let r = Kt.parse(t),
        o = [];
      for (let i of r) {
        let s = JSON.parse(i);
        if (typeof s.type != "number") throw new Error("Invalid payload.");
        switch (s.type) {
          case Q.Invocation:
            this._isInvocationMessage(s);
            break;
          case Q.StreamItem:
            this._isStreamItemMessage(s);
            break;
          case Q.Completion:
            this._isCompletionMessage(s);
            break;
          case Q.Ping:
            break;
          case Q.Close:
            break;
          case Q.Ack:
            this._isAckMessage(s);
            break;
          case Q.Sequence:
            this._isSequenceMessage(s);
            break;
          default:
            n.log(
              _.Information,
              "Unknown message type '" + s.type + "' ignored."
            );
            continue;
        }
        o.push(s);
      }
      return o;
    }
    writeMessage(t) {
      return Kt.write(JSON.stringify(t));
    }
    _isInvocationMessage(t) {
      this._assertNotEmptyString(
        t.target,
        "Invalid payload for Invocation message."
      ),
        t.invocationId !== void 0 &&
          this._assertNotEmptyString(
            t.invocationId,
            "Invalid payload for Invocation message."
          );
    }
    _isStreamItemMessage(t) {
      if (
        (this._assertNotEmptyString(
          t.invocationId,
          "Invalid payload for StreamItem message."
        ),
        t.item === void 0)
      )
        throw new Error("Invalid payload for StreamItem message.");
    }
    _isCompletionMessage(t) {
      if (t.result && t.error)
        throw new Error("Invalid payload for Completion message.");
      !t.result &&
        t.error &&
        this._assertNotEmptyString(
          t.error,
          "Invalid payload for Completion message."
        ),
        this._assertNotEmptyString(
          t.invocationId,
          "Invalid payload for Completion message."
        );
    }
    _isAckMessage(t) {
      if (typeof t.sequenceId != "number")
        throw new Error("Invalid SequenceId for Ack message.");
    }
    _isSequenceMessage(t) {
      if (typeof t.sequenceId != "number")
        throw new Error("Invalid SequenceId for Sequence message.");
    }
    _assertNotEmptyString(t, n) {
      if (typeof t != "string" || t === "") throw new Error(n);
    }
  };
var jN = {
  trace: _.Trace,
  debug: _.Debug,
  info: _.Information,
  information: _.Information,
  warn: _.Warning,
  warning: _.Warning,
  error: _.Error,
  critical: _.Critical,
  none: _.None,
};
function UN(e) {
  let t = jN[e.toLowerCase()];
  if (typeof t < "u") return t;
  throw new Error(`Unknown log level: ${e}`);
}
var jo = class {
  configureLogging(t) {
    if ((he.isRequired(t, "logging"), BN(t))) this.logger = t;
    else if (typeof t == "string") {
      let n = UN(t);
      this.logger = new Lo(n);
    } else this.logger = new Lo(t);
    return this;
  }
  withUrl(t, n) {
    return (
      he.isRequired(t, "url"),
      he.isNotEmpty(t, "url"),
      (this.url = t),
      typeof n == "object"
        ? (this.httpConnectionOptions = b(b({}, this.httpConnectionOptions), n))
        : (this.httpConnectionOptions = B(b({}, this.httpConnectionOptions), {
            transport: n,
          })),
      this
    );
  }
  withHubProtocol(t) {
    return he.isRequired(t, "protocol"), (this.protocol = t), this;
  }
  withAutomaticReconnect(t) {
    if (this.reconnectPolicy)
      throw new Error("A reconnectPolicy has already been set.");
    return (
      t
        ? Array.isArray(t)
          ? (this.reconnectPolicy = new Aa(t))
          : (this.reconnectPolicy = t)
        : (this.reconnectPolicy = new Aa()),
      this
    );
  }
  withServerTimeout(t) {
    return (
      he.isRequired(t, "milliseconds"),
      (this._serverTimeoutInMilliseconds = t),
      this
    );
  }
  withKeepAliveInterval(t) {
    return (
      he.isRequired(t, "milliseconds"),
      (this._keepAliveIntervalInMilliseconds = t),
      this
    );
  }
  withStatefulReconnect(t) {
    return (
      this.httpConnectionOptions === void 0 &&
        (this.httpConnectionOptions = {}),
      (this.httpConnectionOptions._useStatefulReconnect = !0),
      (this._statefulReconnectBufferSize = t?.bufferSize),
      this
    );
  }
  build() {
    let t = this.httpConnectionOptions || {};
    if ((t.logger === void 0 && (t.logger = this.logger), !this.url))
      throw new Error(
        "The 'HubConnectionBuilder.withUrl' method must be called before building the connection."
      );
    let n = new td(this.url, t);
    return Na.create(
      n,
      this.logger || Zn.instance,
      this.protocol || new nd(),
      this.reconnectPolicy,
      this._serverTimeoutInMilliseconds,
      this._keepAliveIntervalInMilliseconds,
      this._statefulReconnectBufferSize
    );
  }
};
function BN(e) {
  return e.log !== void 0;
}
var Qn = class e {
  hubUrl = it.hubUrl;
  toast = f(Ot);
  hubConnection;
  onlineUsers = j([]);
  createHubConnection(t) {
    (this.hubConnection = new jo()
      .withUrl(this.hubUrl + "presence", { accessTokenFactory: () => t.token })
      .withAutomaticReconnect()
      .build()),
      this.hubConnection.start().catch((n) => console.log(n)),
      this.hubConnection.on("UserOnline", (n) => {
        this.onlineUsers.update((r) => [...r, n]);
      }),
      this.hubConnection.on("UserOffline", (n) => {
        this.onlineUsers.update((r) => r.filter((o) => o !== n));
      }),
      this.hubConnection.on("GetOnlineUsers", (n) => {
        this.onlineUsers.set(n);
      }),
      this.hubConnection.on("NewMessageReceived", (n) => {
        this.toast.info(
          n.senderDisplayName + ": " + n.content,
          1e4,
          n.senderImageUrl,
          `/members/${n.senderId}/messages`
        );
      });
  }
  stopHubConnection() {
    this.hubConnection?.state === ce.Connected &&
      this.hubConnection.stop().catch((t) => console.log(t));
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var _e = class e {
  http = f(At);
  likesService = f(Wn);
  presenceService = f(Qn);
  currentUser = j(null);
  baseUrl = it.apiUrl;
  register(t) {
    return this.http
      .post(this.baseUrl + "account/register", t, { withCredentials: !0 })
      .pipe(
        le((n) => {
          n && (this.setCurrentUser(n), this.startTokenRefreshInterval());
        })
      );
  }
  login(t) {
    return this.http
      .post(this.baseUrl + "account/login", t, { withCredentials: !0 })
      .pipe(
        le((n) => {
          n && (this.setCurrentUser(n), this.startTokenRefreshInterval());
        })
      );
  }
  refreshToken() {
    return this.http.post(
      this.baseUrl + "account/refresh-token",
      {},
      { withCredentials: !0 }
    );
  }
  startTokenRefreshInterval() {
    setInterval(() => {
      this.http
        .post(
          this.baseUrl + "account/refresh-token",
          {},
          { withCredentials: !0 }
        )
        .subscribe({
          next: (t) => {
            this.setCurrentUser(t);
          },
          error: () => {
            this.logout();
          },
        });
    }, 300 * 1e3);
  }
  setCurrentUser(t) {
    (t.roles = this.getRolesFromToken(t)),
      this.currentUser.set(t),
      this.likesService.getLikesIds(),
      this.presenceService.hubConnection?.state !== ce.Connected &&
        this.presenceService.createHubConnection(t);
  }
  logout() {
    this.http
      .post(this.baseUrl + "account/logout", {}, { withCredentials: !0 })
      .subscribe({
        next: () => {
          localStorage.removeItem("filters"),
            this.likesService.clearLikeIds(),
            this.currentUser.set(null),
            this.presenceService.stopHubConnection();
        },
      });
  }
  getRolesFromToken(t) {
    let n = t.token.split(".")[1],
      r = atob(n),
      o = JSON.parse(r);
    return Array.isArray(o.role) ? o.role : [o.role];
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
function HN(e, t) {
  if ((e & 1 && (h(0, "div", 2), y(1), m()), e & 2)) {
    let n = E();
    v(), Ce("", n.label(), " is required");
  }
}
function $N(e, t) {
  e & 1 && (h(0, "div", 2), y(1, "Invalid email address"), m());
}
function zN(e, t) {
  if ((e & 1 && (h(0, "div", 2), y(1), m()), e & 2)) {
    let n = E();
    v(),
      Bn(
        " ",
        n.label(),
        " must be at least ",
        n.control.errors == null
          ? null
          : n.control.errors.minlength.requiredLength,
        " characters "
      );
  }
}
function GN(e, t) {
  if ((e & 1 && (h(0, "div", 2), y(1), m()), e & 2)) {
    let n = E();
    v(),
      Bn(
        " ",
        n.label(),
        " must be at most ",
        n.control.errors == null
          ? null
          : n.control.errors.maxlength.requiredLength,
        " characters "
      );
  }
}
function WN(e, t) {
  e & 1 && (h(0, "div", 2), y(1, "Passwords do not match"), m());
}
var rd = class e {
  constructor(t) {
    this.ngControl = t;
    this.ngControl.valueAccessor = this;
  }
  label = Le("");
  type = Le("text");
  maxDate = Le("");
  writeValue(t) {}
  registerOnChange(t) {}
  registerOnTouched(t) {}
  get control() {
    return this.ngControl.control;
  }
  static ɵfac = function (n) {
    return new (n || e)(k(dn, 2));
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-text-input"]],
    inputs: { label: [1, "label"], type: [1, "type"], maxDate: [1, "maxDate"] },
    decls: 9,
    vars: 14,
    consts: [
      [1, "floating-label", "text-left"],
      [1, "input", "w-full", 3, "type", "max", "formControl", "placeholder"],
      [1, "validation-hint", "text-error", "text-xs"],
    ],
    template: function (n, r) {
      n & 1 &&
        (h(0, "label", 0)(1, "span"),
        y(2),
        m(),
        U(3, "input", 1),
        P(4, HN, 2, 1, "div", 2),
        P(5, $N, 2, 0, "div", 2),
        P(6, zN, 2, 2, "div", 2),
        P(7, GN, 2, 2, "div", 2),
        P(8, WN, 2, 0, "div", 2),
        m()),
        n & 2 &&
          (v(2),
          oe(r.label()),
          v(),
          fe("input-error", r.control.invalid && r.control.touched)(
            "input-success",
            r.control.valid && r.control.touched
          ),
          Z("type", r.type())("max", r.maxDate())("formControl", r.control)(
            "placeholder",
            r.label()
          ),
          v(),
          F(r.control.hasError("required") && r.control.touched ? 4 : -1),
          v(),
          F(r.control.hasError("email") && r.control.touched ? 5 : -1),
          v(),
          F(r.control.hasError("minlength") && r.control.touched ? 6 : -1),
          v(),
          F(r.control.hasError("maxlength") && r.control.touched ? 7 : -1),
          v(),
          F(
            r.control.hasError("passwordMismatch") && r.control.touched ? 8 : -1
          ));
    },
    dependencies: [Lu, kt, fn, Wm],
    encapsulation: 2,
  });
};
function qN(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "form", 6),
      U(1, "app-text-input", 9)(2, "app-text-input", 10)(
        3,
        "app-text-input",
        11
      )(4, "app-text-input", 12),
      h(5, "div", 13)(6, "button", 14),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.cancel());
      }),
      y(7, "Cancel"),
      m(),
      h(8, "button", 15),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.nextStep());
      }),
      y(9, " Next "),
      m()()();
  }
  if (e & 2) {
    let n = E();
    Z("formGroup", n.credentialsForm),
      v(8),
      Z("disabled", !n.credentialsForm.valid);
  }
}
function ZN(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "form", 7)(1, "div", 16)(2, "div", 17),
      y(3, "Gender:"),
      m(),
      h(4, "label", 18)(5, "span"),
      y(6, "Male"),
      m(),
      U(7, "input", 19),
      m(),
      h(8, "label", 18)(9, "span"),
      y(10, "Female"),
      m(),
      U(11, "input", 20),
      m()(),
      U(12, "app-text-input", 21)(13, "app-text-input", 22)(
        14,
        "app-text-input",
        23
      ),
      h(15, "div", 13)(16, "button", 14),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.prevStep());
      }),
      y(17, "Back"),
      m(),
      h(18, "button", 24),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.register());
      }),
      y(19, " Register "),
      m()()();
  }
  if (e & 2) {
    let n = E();
    Z("formGroup", n.profileForm),
      v(12),
      Z("maxDate", n.getMaxDate()),
      v(6),
      Z("disabled", !n.profileForm.valid);
  }
}
function YN(e, t) {
  if ((e & 1 && (h(0, "li"), y(1), m()), e & 2)) {
    let n = t.$implicit;
    v(), oe(n);
  }
}
function QN(e, t) {
  if (
    (e & 1 &&
      (h(0, "div", 8)(1, "ul", 25), ge(2, YN, 2, 1, "li", null, rt), m()()),
    e & 2)
  ) {
    let n = E();
    v(2), ve(n.validationErrors());
  }
}
var od = class e {
  accountService = f(_e);
  router = f(Ne);
  fb = f(uC);
  cancelRegister = Wt();
  creds = {};
  credentialsForm;
  profileForm;
  currrentStep = j(1);
  validationErrors = j([]);
  constructor() {
    (this.credentialsForm = this.fb.group({
      email: ["", [Rt.required, Rt.email]],
      displayName: ["", Rt.required],
      password: ["", [Rt.required, Rt.minLength(4), Rt.maxLength(8)]],
      confirmPassword: ["", [Rt.required, this.matchValues("password")]],
    })),
      (this.profileForm = this.fb.group({
        gender: ["male", Rt.required],
        dateOfBirth: ["", Rt.required],
        city: ["", Rt.required],
        country: ["", Rt.required],
      })),
      this.credentialsForm.controls.password.valueChanges.subscribe(() => {
        this.credentialsForm.controls.confirmPassword.updateValueAndValidity();
      });
  }
  matchValues(t) {
    return (n) => {
      let r = n.parent;
      if (!r) return null;
      let o = r.get(t)?.value;
      return n.value === o ? null : { passwordMismatch: !0 };
    };
  }
  nextStep() {
    this.credentialsForm.valid && this.currrentStep.update((t) => t + 1);
  }
  prevStep() {
    this.currrentStep.update((t) => t + 1);
  }
  getMaxDate() {
    let t = new Date();
    return t.setFullYear(t.getFullYear() - 18), t.toISOString().split("T")[0];
  }
  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      let t = b(b({}, this.credentialsForm.value), this.profileForm.value);
      this.accountService.register(t).subscribe({
        next: () => {
          this.router.navigateByUrl("/members");
        },
        error: (n) => {
          console.log(n), this.validationErrors.set(n);
        },
      });
    }
  }
  cancel() {
    this.cancelRegister.emit(!1);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-register"]],
    outputs: { cancelRegister: "cancelRegister" },
    decls: 12,
    vars: 5,
    consts: [
      [
        1,
        "card",
        "bg-base-100",
        "w-1/2",
        "mx-auto",
        "flex",
        "flex-col",
        "p-6",
        "rounded-lg",
        "shadow-lg",
      ],
      [1, "card-title", "justify-center", "text-3xl", "text-primary"],
      [1, "card-body", "w-full"],
      [1, "steps"],
      [1, "step", "step-primary"],
      [1, "step"],
      [1, "flex", "flex-col", "gap-4", "w-full", "steps", 3, "formGroup"],
      [1, "flex", "flex-col", "w-full", "gap-4", "steps", 3, "formGroup"],
      [
        1,
        "mt-5",
        "flex",
        "bg-gray-200",
        "rounded-2xl",
        "w-1/2",
        "p-3",
        "mx-auto",
      ],
      ["label", "Email", "formControlName", "email", 1, "mt-2"],
      ["label", "Display Name", "formControlName", "displayName"],
      ["label", "Password", "formControlName", "password", "type", "password"],
      [
        "label",
        "Confirm Password",
        "formControlName",
        "confirmPassword",
        "type",
        "password",
      ],
      [1, "flex", "items-center", "justify-end", "gap-3"],
      ["type", "button", 1, "btn", 3, "click"],
      ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"],
      [1, "flex", "items-center", "gap-3"],
      [1, "font-semibold"],
      [1, "flex", "gap-3", "items-center"],
      [
        "type",
        "radio",
        "formControlName",
        "gender",
        "value",
        "male",
        1,
        "radio",
        "radio-primary",
      ],
      [
        "type",
        "radio",
        "formControlName",
        "gender",
        "value",
        "female",
        1,
        "radio",
        "radio-primary",
      ],
      [
        "type",
        "date",
        "label",
        "Date of bith",
        "formControlName",
        "dateOfBirth",
        3,
        "maxDate",
      ],
      ["label", "City", "formControlName", "city"],
      ["label", "Country", "formControlName", "country"],
      [1, "btn", "btn-primary", 3, "click", "disabled"],
      [1, "flex", "flex-col", "text-error", "space-y-1"],
    ],
    template: function (n, r) {
      n & 1 &&
        (h(0, "div", 0)(1, "div", 1),
        y(2, "Sign up"),
        m(),
        h(3, "div", 2)(4, "ul", 3)(5, "li", 4),
        y(6, "Credentials"),
        m(),
        h(7, "li", 5),
        y(8, "Profile"),
        m()(),
        P(9, qN, 10, 2, "form", 6),
        P(10, ZN, 20, 3, "form", 7),
        m(),
        P(11, QN, 4, 0, "div", 8),
        m()),
        n & 2 &&
          (v(7),
          fe("step-primary", r.currrentStep() === 2),
          v(2),
          F(r.currrentStep() === 1 ? 9 : -1),
          v(),
          F(r.currrentStep() === 2 ? 10 : -1),
          v(),
          F(r.validationErrors().length > 0 ? 11 : -1));
    },
    dependencies: [Gn, Hr, kt, Ta, fn, Br, Lu, qm, Zm, rd],
    encapsulation: 2,
  });
};
function KN(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 1)(1, "div", 3),
      ke(),
      h(2, "svg", 4),
      U(3, "path", 5),
      m(),
      vt(),
      h(4, "h1", 6),
      y(5, "Find your match"),
      m(),
      h(6, "p", 7),
      y(7, "Come on in... all you need to do is sign up"),
      m(),
      h(8, "div", 8)(9, "button", 9),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.showRegister(!0));
      }),
      y(10, "Register"),
      m(),
      h(11, "button", 10),
      y(12, "Learn more"),
      m()()()();
  }
}
function JN(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 2)(1, "app-register", 11),
      O("cancelRegister", function (o) {
        I(n);
        let i = E();
        return S(i.showRegister(o));
      }),
      m()();
  }
}
var id = class e {
  registerMode = j(!1);
  showRegister(t) {
    this.registerMode.set(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-home"]],
    decls: 3,
    vars: 1,
    consts: [
      [1, "hero", "bg-base-200", "min-h-screen"],
      [1, "hero-content", "text-center"],
      [1, "w-full", "text-2xl", "text-center", "flex", "justify-center"],
      [1, "flex", "flex-col", "items-center"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 24 24",
        "fill",
        "currentColor",
        1,
        "size-60",
        "text-primary",
      ],
      [
        "d",
        "M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z",
      ],
      [1, "text-5xl", "font-bold"],
      [1, "py-6"],
      [1, "flex", "items-center", "gap-3"],
      [1, "btn", "btn-primary", "btn-lg", 3, "click"],
      [1, "btn", "btn-info", "btn-lg"],
      [1, "w-full", 3, "cancelRegister"],
    ],
    template: function (n, r) {
      n & 1 &&
        (h(0, "div", 0), P(1, KN, 13, 0, "div", 1)(2, JN, 2, 0, "div", 2), m()),
        n & 2 && (v(), F(r.registerMode() ? 2 : 1));
    },
    dependencies: [od],
    encapsulation: 2,
  });
};
var Pt = class e {
  http = f(At);
  baseUrl = it.apiUrl;
  editMode = j(!1);
  member = j(null);
  getMembers(t) {
    let n = new wt();
    return (
      (n = n.append("pageNumber", t.pageNumber)),
      (n = n.append("pageSize", t.pageSize)),
      (n = n.append("minAge", t.minAge)),
      (n = n.append("maxAge", t.maxAge)),
      (n = n.append("orderBy", t.orderBy)),
      t.gender && (n = n.append("gender", t.gender)),
      this.http.get(this.baseUrl + "members", { params: n }).pipe(
        le(() => {
          localStorage.setItem("filters", JSON.stringify(t));
        })
      )
    );
  }
  getMember(t) {
    return this.http.get(this.baseUrl + "members/" + t).pipe(
      le((n) => {
        this.member.set(n);
      })
    );
  }
  getMemberPhotos(t) {
    return this.http.get(this.baseUrl + "members/" + t + "/photos");
  }
  updateMember(t) {
    return this.http.put(this.baseUrl + "members", t);
  }
  uploadPhoto(t) {
    let n = new FormData();
    return (
      n.append("file", t), this.http.post(this.baseUrl + "members/add-photo", n)
    );
  }
  setMainPhoto(t) {
    return this.http.put(this.baseUrl + "members/set-main-photo/" + t.id, {});
  }
  deletePhoto(t) {
    return this.http.delete(this.baseUrl + "members/delete-photo/" + t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Kn = class {
  gender;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 10;
  orderBy = "lastActive";
};
var Gi = class e {
  transform(t) {
    let n = new Date(),
      r = new Date(t),
      o = n.getFullYear() - r.getFullYear(),
      i = n.getMonth() - r.getMonth();
    return (i < 0 || (i === 0 && n.getDate() < r.getDate())) && o--, o;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵpipe = Do({ name: "age", type: e, pure: !0 });
};
function XN(e, t) {
  e & 1 && U(0, "span", 1);
}
function eA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 0),
      P(1, XN, 1, 0, "span", 1),
      U(2, "img", 2),
      h(3, "button", 3),
      O("click", function (o) {
        I(n);
        let i = E();
        return S(i.toggleLike(o));
      }),
      ke(),
      h(4, "svg", 4),
      U(5, "path", 5),
      m()(),
      vt(),
      h(6, "div", 6)(7, "div", 7)(8, "span", 8),
      y(9),
      Gt(10, "age"),
      m(),
      h(11, "span", 9),
      y(12),
      m()()()();
  }
  if (e & 2) {
    let n = t,
      r = E();
    Z("routerLink", Rr("/members/", n.id)),
      v(),
      F(r.isOnline() ? 1 : -1),
      v(),
      Z(
        "src",
        Dn((n == null ? null : n.imageUrl) || "/user.png"),
        ft
      )("alt", Rr("", n.displayName, " image")),
      v(2),
      an("fill", r.hasLiked() ? "red" : "none"),
      v(5),
      Bn("", n.displayName, ", ", lr(10, 11, n.dateOfBirth)),
      v(3),
      oe(n.city);
  }
}
var Wi = class e {
  likeService = f(Wn);
  presenceServie = f(Qn);
  member = Le.required();
  hasLiked = Dt(() => this.likeService.likeIds().includes(this.member().id));
  isOnline = Dt(() =>
    this.presenceServie.onlineUsers().includes(this.member().id)
  );
  toggleLike(t) {
    t.stopPropagation(), this.likeService.toggleLike(this.member().id);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-card"]],
    inputs: { member: [1, "member"] },
    decls: 1,
    vars: 1,
    consts: [
      [
        1,
        "card",
        "cursor-pointer",
        "transition-all",
        "duration-300",
        "ease-in-out",
        "transform",
        "hover:-translate-y-2",
        "relative",
        3,
        "routerLink",
      ],
      [
        1,
        "status",
        "status-success",
        "status-xl",
        "absolute",
        "top-3",
        "left-3",
      ],
      [1, "rounded-lg", 3, "src", "alt"],
      [
        1,
        "absolute",
        "top-1",
        "right-1",
        "z-40",
        "btn",
        "btn-ghost",
        "btn-circle",
        3,
        "click",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-7",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
      ],
      [
        1,
        "card-actions",
        "z-40",
        "absolute",
        "bottom-0",
        "w-full",
        "px-3",
        "py-1",
        "rounded-b-lg",
        "bg-gradient-to-t",
        "from-black",
        "via-black/75",
        "to-black/0",
      ],
      [1, "flex", "flex-col", "text-white"],
      [1, "font-semibold"],
      [1, "text-sm"],
    ],
    template: function (n, r) {
      if ((n & 1 && P(0, eA, 13, 13, "div", 0), n & 2)) {
        let o;
        F((o = r.member()) ? 0 : -1, o);
      }
    },
    dependencies: [un, Gi],
    encapsulation: 2,
  });
};
function tA(e, t) {
  if ((e & 1 && (A(0, "option", 2), y(1), R()), e & 2)) {
    let n = t.$implicit,
      r = E();
    bt("value", n)("selected", n === r.pageSize()), v(), oe(n);
  }
}
var Gr = class e {
  pageNumber = js(1);
  pageSize = js(10);
  totalCount = Le(0);
  totalPages = Le(0);
  pageSizeOptions = Le([5, 10, 20, 50]);
  constructor() {
    console.log(this.pageNumber());
  }
  pageChange = Wt();
  lastItemIndex = Dt(() =>
    Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  );
  onPageChange(t, n) {
    if ((t && this.pageNumber.set(t), n)) {
      let r = Number(n.value);
      this.pageSize.set(r);
    }
    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-paginator"]],
    inputs: {
      pageNumber: [1, "pageNumber"],
      pageSize: [1, "pageSize"],
      totalCount: [1, "totalCount"],
      totalPages: [1, "totalPages"],
      pageSizeOptions: [1, "pageSizeOptions"],
    },
    outputs: {
      pageNumber: "pageNumberChange",
      pageSize: "pageSizeChange",
      pageChange: "pageChange",
    },
    decls: 13,
    vars: 5,
    consts: [
      [1, "flex", "items-center", "w-full", "gap-3", "py-3"],
      [1, "select", "w-24", 3, "change"],
      [3, "value", "selected"],
      [1, "text-sm"],
      [1, "flex", "items-center", "gap-2"],
      [1, "btn", "btn-circle", "btn-ghost", 3, "click", "disabled"],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "div", 0)(1, "span"),
        y(2, "Items per page:"),
        R(),
        A(3, "select", 1),
        ie("change", function (i) {
          return r.onPageChange(void 0, i.target);
        }),
        ge(4, tA, 2, 3, "option", 2, rt),
        R(),
        A(6, "div", 3),
        y(7),
        R(),
        A(8, "div", 4)(9, "button", 5),
        ie("click", function () {
          return r.onPageChange(r.pageNumber() - 1);
        }),
        y(10, " \u2190 "),
        R(),
        A(11, "button", 5),
        ie("click", function () {
          return r.onPageChange(r.pageNumber() + 1);
        }),
        y(12, " \u2192 "),
        R()()()),
        n & 2 &&
          (v(4),
          ve(r.pageSizeOptions()),
          v(3),
          Ol(
            " ",
            (r.pageNumber() - 1) * r.pageSize() + 1,
            " - ",
            r.lastItemIndex(),
            " of ",
            r.totalCount(),
            " "
          ),
          v(2),
          bt("disabled", r.pageNumber() === 1),
          v(2),
          bt("disabled", r.pageNumber() >= r.totalPages()));
    },
    encapsulation: 2,
  });
};
var nA = ["filterModal"],
  sd = class e {
    modalRef;
    closeModal = Wt();
    submitData = Wt();
    memberParams = js(new Kn());
    constructor() {
      let t = localStorage.getItem("filters");
      t && this.memberParams.set(JSON.parse(t));
    }
    open() {
      this.modalRef.nativeElement.showModal();
    }
    close() {
      this.modalRef.nativeElement.close(), this.closeModal.emit();
    }
    submit() {
      this.submitData.emit(this.memberParams()), this.close();
    }
    onMinAgeChange() {
      this.memberParams().minAge < 18 && (this.memberParams().minAge = 18);
    }
    onMaxAgeChange() {
      this.memberParams().maxAge < this.memberParams().minAge &&
        (this.memberParams().maxAge = this.memberParams().minAge);
    }
    static ɵfac = function (n) {
      return new (n || e)();
    };
    static ɵcmp = L({
      type: e,
      selectors: [["app-filter-modal"]],
      viewQuery: function (n, r) {
        if ((n & 1 && $t(nA, 5), n & 2)) {
          let o;
          Ct((o = Et())) && (r.modalRef = o.first);
        }
      },
      inputs: { memberParams: [1, "memberParams"] },
      outputs: {
        closeModal: "closeModal",
        submitData: "submitData",
        memberParams: "memberParamsChange",
      },
      decls: 36,
      vars: 7,
      consts: [
        ["filterModal", ""],
        [1, "modal"],
        [1, "modal-box", "max-w-lg"],
        [1, "text-lg", "font-bold"],
        [1, "flex", "justify-between", "w-full", "items-center", "mt-6"],
        [1, "flex", "flex-col", "w-full", "gap-6"],
        [1, "flex", "justify-between", "items-center"],
        [1, "font-semibold"],
        [1, "filter"],
        ["type", "reset", "value", "x", 1, "btn", "btn-square"],
        [
          "type",
          "radio",
          "aria-label",
          "Male",
          "name",
          "gender",
          "value",
          "male",
          1,
          "btn",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [
          "type",
          "radio",
          "aria-label",
          "Female",
          "name",
          "gender",
          "value",
          "female",
          1,
          "btn",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [1, "flex", "gap-3"],
        [
          "type",
          "number",
          "name",
          "minAge",
          1,
          "input",
          "w-20",
          3,
          "ngModelChange",
          "click",
          "min",
          "ngModel",
        ],
        [
          "type",
          "number",
          "name",
          "maxAge",
          1,
          "input",
          "w-20",
          3,
          "ngModelChange",
          "click",
          "min",
          "ngModel",
        ],
        ["name", "orderBy", 1, "select", 3, "ngModelChange", "ngModel"],
        ["disabled", "", "selected", ""],
        ["value", "created"],
        ["value", "lastActive"],
        [1, "modal-action"],
        [1, "btn", "btn-primary", 3, "click"],
        ["method", "dialog", 1, "modal-backdrop"],
        [3, "click"],
      ],
      template: function (n, r) {
        if (n & 1) {
          let o = Y();
          h(0, "dialog", 1, 0)(2, "div", 2)(3, "h3", 3),
            y(4, "Select filters"),
            m(),
            h(5, "div", 4)(6, "div", 5)(7, "label", 6)(8, "span", 7),
            y(9, "Select gender"),
            m(),
            h(10, "form", 8),
            U(11, "input", 9),
            h(12, "input", 10),
            Qe("ngModelChange", function (s) {
              return (
                I(o),
                ot(r.memberParams().gender, s) || (r.memberParams().gender = s),
                S(s)
              );
            }),
            m(),
            h(13, "input", 11),
            Qe("ngModelChange", function (s) {
              return (
                I(o),
                ot(r.memberParams().gender, s) || (r.memberParams().gender = s),
                S(s)
              );
            }),
            m()()(),
            h(14, "label", 6)(15, "span", 7),
            y(16, "Select age"),
            m(),
            h(17, "div", 12)(18, "input", 13),
            Qe("ngModelChange", function (s) {
              return (
                I(o),
                ot(r.memberParams().minAge, s) || (r.memberParams().minAge = s),
                S(s)
              );
            }),
            O("click", function () {
              return I(o), S(r.onMinAgeChange());
            }),
            m(),
            h(19, "input", 14),
            Qe("ngModelChange", function (s) {
              return (
                I(o),
                ot(r.memberParams().maxAge, s) || (r.memberParams().maxAge = s),
                S(s)
              );
            }),
            O("click", function () {
              return I(o), S(r.onMaxAgeChange());
            }),
            m()()(),
            h(20, "label", 6)(21, "span", 7),
            y(22, "Order by: "),
            m(),
            h(23, "select", 15),
            Qe("ngModelChange", function (s) {
              return (
                I(o),
                ot(r.memberParams().orderBy, s) ||
                  (r.memberParams().orderBy = s),
                S(s)
              );
            }),
            h(24, "option", 16),
            y(25, "Order by"),
            m(),
            h(26, "option", 17),
            y(27, "Newest member"),
            m(),
            h(28, "option", 18),
            y(29, "Last active"),
            m()()()()(),
            h(30, "div", 19)(31, "button", 20),
            O("click", function () {
              return I(o), S(r.submit());
            }),
            y(32, "Submit"),
            m()()(),
            h(33, "form", 21)(34, "button", 22),
            O("click", function () {
              return I(o), S(r.close());
            }),
            y(35, "Close"),
            m()()();
        }
        n & 2 &&
          (v(12),
          Ye("ngModel", r.memberParams().gender),
          v(),
          Ye("ngModel", r.memberParams().gender),
          v(5),
          Z("min", 18),
          Ye("ngModel", r.memberParams().minAge),
          v(),
          Z("min", r.memberParams().minAge || 18),
          Ye("ngModel", r.memberParams().maxAge),
          v(4),
          Ye("ngModel", r.memberParams().orderBy));
      },
      dependencies: [Gn, Hr, sC, cC, kt, zm, Fu, Ta, fn, Br, Ym, mr, Fo],
      encapsulation: 2,
    });
  };
var rA = ["filterModal"],
  oA = (e, t) => t.id;
function iA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "app-paginator", 10),
      O("pageChange", function (o) {
        I(n);
        let i = E(2);
        return S(i.onPageChange(o));
      }),
      m();
  }
  if (e & 2) {
    let n = t;
    Z("pageNumber", n.currentPage)("totalCount", n.totalCount)(
      "totalPages",
      n.totalPages
    )("pageSize", n.pageSize);
  }
}
function sA(e, t) {
  if ((e & 1 && U(0, "app-member-card", 11), e & 2)) {
    let n = t.$implicit;
    Z("member", n);
  }
}
function aA(e, t) {
  e & 1 && (h(0, "div", 9), ge(1, sA, 1, 1, "app-member-card", 11, oA), m()),
    e & 2 && (v(), ve(t));
}
function cA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 1)(1, "div", 3)(2, "div", 4)(3, "div", 5),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.openModal());
      }),
      y(4, "Select Filters"),
      m(),
      h(5, "div", 6),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.resetFilters());
      }),
      y(6, "Reset Filters"),
      m(),
      h(7, "div", 7),
      y(8),
      m()(),
      P(9, iA, 1, 4, "app-paginator", 8),
      m(),
      P(10, aA, 3, 0, "div", 9),
      m();
  }
  if (e & 2) {
    let n,
      r,
      o = t,
      i = E();
    v(8),
      Ce(" ", i.displayMessage, " "),
      v(),
      F((n = o.metadata) ? 9 : -1, n),
      v(),
      F((r = o.items) ? 10 : -1, r);
  }
}
var ad = class e {
  modal;
  memberService = f(Pt);
  paginatedMembers = j(null);
  memberParams = new Kn();
  updatedParams = new Kn();
  constructor() {
    let t = localStorage.getItem("filters");
    t &&
      ((this.memberParams = JSON.parse(t)),
      (this.updatedParams = JSON.parse(t)));
  }
  ngOnInit() {
    this.loadMembers();
  }
  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (t) => {
        this.paginatedMembers.set(t);
      },
    });
  }
  onPageChange(t) {
    (this.memberParams.pageSize = t.pageSize),
      (this.memberParams.pageNumber = t.pageNumber),
      this.loadMembers();
  }
  openModal() {
    this.modal.open();
  }
  onClose() {
    console.log("Modal Close");
  }
  onFilterChange(t) {
    (this.memberParams = b({}, t)),
      (this.updatedParams = b({}, t)),
      this.loadMembers();
  }
  resetFilters() {
    (this.memberParams = new Kn()),
      (this.updatedParams = new Kn()),
      this.loadMembers();
  }
  get displayMessage() {
    let t = new Kn(),
      n = [];
    return (
      this.updatedParams.gender
        ? n.push(this.updatedParams.gender + "s")
        : n.push("Males, Females"),
      (this.updatedParams.minAge !== t.minAge ||
        this.updatedParams.maxAge !== t.maxAge) &&
        n.push(
          ` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`
        ),
      n.push(
        this.updatedParams.orderBy === "lastActive"
          ? "Recently active"
          : "Newest members"
      ),
      n.length > 0 ? `Selected :${n.join("  | ")}` : "All members"
    );
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-list"]],
    viewQuery: function (n, r) {
      if ((n & 1 && $t(rA, 5), n & 2)) {
        let o;
        Ct((o = Et())) && (r.modal = o.first);
      }
    },
    decls: 3,
    vars: 2,
    consts: [
      ["filterModal", ""],
      [1, "flex", "flex-col", "w-full"],
      [3, "closeModal", "submitData", "hidden"],
      [1, "flex", "justify-between", "items-center"],
      [1, "flex", "gap-3", "items-center"],
      [1, "btn", "btn-primary", 3, "click"],
      [1, "btn", "btn-neutral", 3, "click"],
      [
        1,
        "text-lg",
        "bg-base-100",
        "py-2",
        "px-4",
        "border-1",
        "rounded-lg",
        "text-primary",
        "capitalize",
      ],
      [3, "pageNumber", "totalCount", "totalPages", "pageSize"],
      [1, "grid", "grid-cols-5", "gap-6"],
      [3, "pageChange", "pageNumber", "totalCount", "totalPages", "pageSize"],
      [3, "member"],
    ],
    template: function (n, r) {
      if (n & 1) {
        let o = Y();
        P(0, cA, 11, 3, "div", 1),
          h(1, "app-filter-modal", 2, 0),
          O("closeModal", function () {
            return I(o), S(r.onClose());
          })("submitData", function (s) {
            return I(o), S(r.onFilterChange(s));
          }),
          m();
      }
      if (n & 2) {
        let o;
        F((o = r.paginatedMembers()) ? 0 : -1, o),
          v(),
          Z("hidden", !r.paginatedMembers());
      }
    },
    dependencies: [Wi, Gr, sd],
    encapsulation: 2,
  });
};
function lA(e, t) {
  e & 1 && U(0, "span", 9);
}
function uA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "button", 24),
      O("click", function () {
        I(n);
        let o = E(2);
        return S(o.memberService.editMode.set(!o.memberService.editMode()));
      }),
      y(1),
      m();
  }
  if (e & 2) {
    let n = E(2);
    v(), Ce(" ", n.memberService.editMode() ? "Cancel" : "Edit", " ");
  }
}
function dA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 0)(1, "div", 1)(2, "button", 2),
      O("click", function (o) {
        I(n);
        let i = E();
        return S(i.toggleLike(o));
      }),
      ke(),
      h(3, "svg", 3),
      U(4, "path", 4),
      m()(),
      vt(),
      U(5, "img", 5),
      h(6, "div", 6)(7, "div", 7)(8, "div", 8),
      y(9),
      Gt(10, "age"),
      P(11, lA, 1, 0, "span", 9),
      m(),
      h(12, "div", 10),
      y(13),
      m()(),
      U(14, "div", 11),
      h(15, "ul", 12)(16, "li")(17, "a", 13),
      y(18, "Profile"),
      m()(),
      h(19, "li")(20, "a", 14),
      y(21, "Photos"),
      m()(),
      h(22, "li")(23, "a", 15),
      y(24, "Messages"),
      m()()()(),
      h(25, "div", 16)(26, "button", 17),
      y(27, "Go back"),
      m(),
      h(28, "button", 18),
      O("click", function () {
        let o = I(n),
          i = E();
        return S(i.likesService.toggleLike(o.id));
      }),
      y(29),
      m()()(),
      h(30, "div", 19)(31, "div", 20)(32, "h3", 21),
      y(33),
      m(),
      P(34, uA, 2, 1, "button", 22),
      m(),
      U(35, "div", 11),
      h(36, "div", 23),
      U(37, "router-outlet"),
      m()()();
  }
  if (e & 2) {
    let n = t,
      r = E();
    v(3),
      an("fill", r.hasLiked() ? "red" : "none"),
      v(2),
      Z("src", Dn(n.imageUrl || "/user.png"), ft),
      v(4),
      Bn(" ", n.displayName, ", ", lr(10, 15, n.dateOfBirth), " "),
      v(2),
      F(r.presenceService.onlineUsers().includes(n.id) ? 11 : -1),
      v(2),
      Bn("", n.city, ", ", n.country),
      v(15),
      fe("btn-error", r.hasLiked())("btn-success", !r.hasLiked()),
      v(),
      Ce(" ", r.hasLiked() ? "Remove like" : "Like user", " "),
      v(4),
      oe(r.title()),
      v(),
      F(r.isCurrentUser() ? 34 : -1);
  }
}
function fA(e, t) {
  e & 1 && (h(0, "div"), y(1, "Member not found"), m());
}
var cd = class e {
  route = f(St);
  memberService = f(Pt);
  likesService = f(Wn);
  accountService = f(_e);
  presenceService = f(Qn);
  router = f(Ne);
  title = j("Profile");
  routeId = j(null);
  member = Le.required();
  isCurrentUser = Dt(
    () => this.accountService.currentUser()?.id === this.routeId()
  );
  hasLiked = Dt(() => this.likesService.likeIds().includes(this.routeId()));
  constructor() {
    this.route.paramMap.subscribe((t) => {
      this.routeId.set(t.get("id"));
    });
  }
  ngOnInit() {
    this.title.set(this.route.firstChild?.snapshot?.title),
      this.router.events.pipe(We((t) => t instanceof Yt)).subscribe({
        next: () => {
          this.title.set(this.route.firstChild?.snapshot?.title);
        },
      });
  }
  toggleLike(t) {
    t.stopPropagation(), this.likesService.toggleLike(this.member().id);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-detailed"]],
    inputs: { member: [1, "member"] },
    decls: 2,
    vars: 1,
    consts: [
      [1, "flex", "gap-6"],
      [1, "card", "bg-base-100", "flex", "flex-col", "h-[85vh]", "w-1/4"],
      [
        1,
        "absolute",
        "top-1",
        "right-1",
        "z-40",
        "btn",
        "btn-ghost",
        "btn-circle",
        3,
        "click",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-7",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
      ],
      [
        "alt",
        "image of member",
        1,
        "rounded-full",
        "mx-10",
        "mt-3",
        "object-cover",
        3,
        "src",
      ],
      [1, "card-body"],
      [1, "flex", "flex-col", "items-center"],
      [1, "flex", "text-2xl", "text-primary", "items-center"],
      [1, "status", "status-success", "status-xl", "ml-3"],
      [1, "text-sm"],
      [1, "divider"],
      [1, "menu", "rounded-box", "w-full", "text-xl"],
      ["routerLink", "profile", "routerLinkActive", "text-primary"],
      ["routerLink", "photos", "routerLinkActive", "text-primary"],
      ["routerLink", "messages", "routerLinkActive", "text-primary"],
      [1, "card-actions", "justify-between", "gap-2", "px-2", "mb-3"],
      ["routerLink", "/members", 1, "btn", "btn-info", "flex-1"],
      [1, "btn", "flex-1", 3, "click"],
      [
        1,
        "card",
        "bg-base-100",
        "w-3/4",
        "p-6",
        "flex",
        "flex-col",
        "h-[85vh]",
      ],
      [1, "flex", "justify-between", "items-center"],
      [1, "card-title", "text-3xl", "text-primary"],
      [1, "btn", "btn-outline", "btn-primary"],
      [1, "h-full"],
      [1, "btn", "btn-outline", "btn-primary", 3, "click"],
    ],
    template: function (n, r) {
      if ((n & 1 && P(0, dA, 38, 17, "div", 0)(1, fA, 2, 0, "div"), n & 2)) {
        let o;
        F((o = r.memberService.member()) ? 0 : 1, o);
      }
    },
    dependencies: [un, va, Oo, Gi],
    encapsulation: 2,
  });
};
var pA = (e, t) => t.id;
function hA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "button", 5),
      O("click", function () {
        let o = I(n).$implicit,
          i = E(2);
        return S(i.setPredicate(o.value));
      }),
      y(1),
      m();
  }
  if (e & 2) {
    let n = t.$implicit,
      r = E(2);
    fe("tab-active", r.predicate === n.value), v(), Ce(" ", n.label, " ");
  }
}
function mA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "app-paginator", 6),
      O("pageChange", function (o) {
        I(n);
        let i = E(2);
        return S(i.onPageChange(o));
      }),
      m();
  }
  if (e & 2) {
    let n = t;
    Z("hidden", n.totalCount === 0)("pageNumber", n.currentPage)(
      "pageSize",
      n.pageSize
    )("totalCount", n.totalCount)("totalPages", n.totalPages);
  }
}
function gA(e, t) {
  if ((e & 1 && U(0, "app-member-card", 9), e & 2)) {
    let n = t.$implicit;
    Z("member", n);
  }
}
function vA(e, t) {
  if (
    (e & 1 && (h(0, "div", 7), ge(1, gA, 1, 1, "app-member-card", 9, pA), m()),
    e & 2)
  ) {
    let n = E();
    v(), ve(n);
  }
}
function yA(e, t) {
  e & 1 && (h(0, "div", 8), y(1, "There are no results for this filter"), m());
}
function _A(e, t) {
  e & 1 && P(0, vA, 3, 0, "div", 7)(1, yA, 2, 0, "div", 8),
    e & 2 && F(t.length > 0 ? 0 : 1);
}
function bA(e, t) {
  if (
    (e & 1 &&
      (h(0, "div", 0)(1, "div", 1)(2, "div", 2),
      ge(3, hA, 2, 3, "button", 3, rt),
      m(),
      P(5, mA, 1, 5, "app-paginator", 4),
      m(),
      P(6, _A, 2, 1),
      m()),
    e & 2)
  ) {
    let n,
      r,
      o = t,
      i = E();
    v(3),
      ve(i.tabs),
      v(2),
      F((n = o.metadata) ? 5 : -1, n),
      v(),
      F((r = o.items) ? 6 : -1, r);
  }
}
var ld = class e {
  likesService = f(Wn);
  paginatedResult = j(null);
  predicate = "liked";
  pageNumber = 1;
  pageSize = 5;
  tabs = [
    { label: "Liked", value: "liked" },
    { label: "Liked me", value: "likedBy" },
    { label: "Mutual", value: "mutual" },
  ];
  ngOnInit() {
    this.loadLikes();
  }
  setPredicate(t) {
    this.predicate !== t &&
      ((this.predicate = t), (this.pageNumber = 1), this.loadLikes());
  }
  loadLikes() {
    this.likesService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe({ next: (t) => this.paginatedResult.set(t) });
  }
  onPageChange(t) {
    (this.pageSize = t.pageSize),
      (this.pageNumber = t.pageNumber),
      this.loadLikes();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-lists"]],
    decls: 1,
    vars: 1,
    consts: [
      [1, "flex", "flex-col", "w-full"],
      [1, "flex", "justify-between", "items-center"],
      [1, "tabs", "tabs-box", "tabs-lg", "text-primary", "w-fit"],
      ["role", "tab", 1, "tab", 3, "tab-active"],
      [3, "hidden", "pageNumber", "pageSize", "totalCount", "totalPages"],
      ["role", "tab", 1, "tab", 3, "click"],
      [
        3,
        "pageChange",
        "hidden",
        "pageNumber",
        "pageSize",
        "totalCount",
        "totalPages",
      ],
      [1, "grid", "grid-cols-5", "gap-6", "mt-3"],
      [1, "mt-3", "text-lg"],
      [3, "member"],
    ],
    template: function (n, r) {
      if ((n & 1 && P(0, bA, 7, 2, "div", 0), n & 2)) {
        let o;
        F((o = r.paginatedResult()) ? 0 : -1, o);
      }
    },
    dependencies: [Wi, Gr],
    encapsulation: 2,
  });
};
var qi = class e {
  baseUrl = it.apiUrl;
  hubUrl = it.hubUrl;
  http = f(At);
  accountService = f(_e);
  hubConnection;
  messageThread = j([]);
  createHubConnection(t) {
    let n = this.accountService.currentUser();
    n &&
      ((this.hubConnection = new jo()
        .withUrl(this.hubUrl + "messages?userId=" + t, {
          accessTokenFactory: () => n.token,
        })
        .withAutomaticReconnect()
        .build()),
      this.hubConnection.start().catch((r) => console.log(r)),
      this.hubConnection.on("ReceiveMessageThread", (r) => {
        this.messageThread.set(
          r.map((o) => B(b({}, o), { currentUserSender: o.senderId !== t }))
        );
      }),
      this.hubConnection.on("NewMessage", (r) => {
        (r.currentUserSender = r.senderId === n.id),
          this.messageThread.update((o) => [...o, r]);
      }));
  }
  stopHubConnection() {
    this.hubConnection?.state === ce.Connected &&
      this.hubConnection.stop().catch((t) => console.log(t));
  }
  getMessages(t, n, r) {
    let o = new wt();
    return (
      (o = o.append("pageNumber", n)),
      (o = o.append("pageSize", r)),
      (o = o.append("container", t)),
      this.http.get(this.baseUrl + "messages", { params: o })
    );
  }
  getMessageThread(t) {
    return this.http.get(this.baseUrl + "messages/thread/" + t);
  }
  sendMessage(t, n) {
    return this.hubConnection?.invoke("SendMessage", {
      recipientId: t,
      content: n,
    });
  }
  deleteMessage(t) {
    return this.http.delete(this.baseUrl + "messages/" + t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Zi = class e {
  dialogComponent;
  register(t) {
    this.dialogComponent = t;
  }
  confirm(t = "Are you sure?") {
    if (!this.dialogComponent)
      throw new Error("Confirm dialog component is not registered");
    return this.dialogComponent.open(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var CA = (e, t) => t.id;
function EA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "button", 11),
      O("click", function () {
        let o = I(n).$implicit,
          i = E();
        return S(i.setContainer(o.value));
      }),
      y(1),
      m();
  }
  if (e & 2) {
    let n = t.$implicit,
      r = E();
    fe("tab-active", r.container === n.value), v(), Ce(" ", n.label, " ");
  }
}
function DA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "app-paginator", 12),
      O("pageChange", function (o) {
        I(n);
        let i = E();
        return S(i.onPageChange(o));
      }),
      m();
  }
  if (e & 2) {
    let n = t;
    Z("hidden", n.totalCount === 0)("pageNumber", n.currentPage)(
      "pageSize",
      n.pageSize
    )("totalCount", n.totalCount)("totalPages", n.totalPages);
  }
}
function wA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "tr", 13)(1, "td", 7)(2, "div", 14)(3, "div", 15),
      U(4, "img", 16),
      m(),
      h(5, "div"),
      y(6),
      m()()(),
      h(7, "td", 17),
      y(8),
      m(),
      h(9, "td", 7),
      y(10),
      Gt(11, "date"),
      m(),
      h(12, "td", 9)(13, "button", 18),
      O("click", function (o) {
        let i = I(n).$implicit,
          s = E();
        return S(s.confirmDelete(o, i.id));
      }),
      ke(),
      h(14, "svg", 19),
      U(15, "path", 20),
      m()()()();
  }
  if (e & 2) {
    let n = t.$implicit,
      r = E();
    fe("font-bold", r.isInbox && !n.dateRead),
      Z(
        "routerLink",
        Rr("/members/", r.isInbox ? n.senderId : n.recipientId, "/messages")
      ),
      v(4),
      Z(
        "src",
        Dn(
          r.isInbox
            ? n.senderImageUrl || "/user.png"
            : n.recipientImageUrl || "/user.png"
        ),
        ft
      ),
      v(2),
      Ce(" ", r.isInbox ? n.senderDisplayName : n.recipientDisplayName, " "),
      v(2),
      oe(n.content),
      v(2),
      oe(Io(11, 9, n.messageSent, "medium"));
  }
}
var ud = class e {
  messageService = f(qi);
  confirmDialog = f(Zi);
  container = "Inbox";
  fetchedContainer = "Inbox";
  pageNumber = 1;
  pageSize = 10;
  paginatedMessages = j(null);
  tabs = [
    { label: "Inbox", value: "Inbox" },
    { label: "Outbox", value: "Outbox" },
  ];
  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    this.messageService
      .getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe({
        next: (t) => {
          this.paginatedMessages.set(t),
            (this.fetchedContainer = this.container);
        },
      });
  }
  async confirmDelete(t, n) {
    t.stopPropagation(),
      (await this.confirmDialog.confirm(
        "Are you sure you want to delete this message?"
      )) && this.deleteMessage(n);
  }
  deleteMessage(t) {
    this.messageService.deleteMessage(t).subscribe({
      next: () => {
        this.paginatedMessages()?.items &&
          this.paginatedMessages.update((r) =>
            r
              ? {
                  items: r.items.filter((i) => i.id !== t) || [],
                  metadata: r.metadata,
                }
              : null
          );
      },
    });
  }
  get isInbox() {
    return this.fetchedContainer === "Inbox";
  }
  setContainer(t) {
    (this.container = t), (this.pageNumber = 1), this.loadMessages();
  }
  onPageChange(t) {
    (this.pageSize = t.pageSize),
      (this.pageNumber = t.pageNumber),
      this.loadMessages();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-messages"]],
    decls: 20,
    vars: 1,
    consts: [
      [1, "flex", "flex-col", "w-full"],
      [1, "flex", "justify-between", "items-center"],
      [1, "tabs", "tabs-box", "tabs-lg", "text-primary", "w-fit"],
      ["role", "tab", 1, "tab", 3, "tab-active"],
      [3, "hidden", "pageNumber", "pageSize", "totalCount", "totalPages"],
      [1, "overflow-x-auto", "mt-3"],
      [1, "table", "bg-base-100", "table-fixed", "w-full"],
      [1, "w-2/9"],
      [1, "w-4/9"],
      [1, "w-1/9"],
      [1, "hover:bg-base-200", "cursor-pointer", 3, "font-bold", "routerLink"],
      ["role", "tab", 1, "tab", 3, "click"],
      [
        3,
        "pageChange",
        "hidden",
        "pageNumber",
        "pageSize",
        "totalCount",
        "totalPages",
      ],
      [1, "hover:bg-base-200", "cursor-pointer", 3, "routerLink"],
      [1, "flex", "items-center", "gap-3"],
      [1, "h-12", "w-12"],
      ["alt", "image of member", 1, "rounded-full", 3, "src"],
      [1, "truncate", "w-4/9"],
      [1, "btn", "btn-circle", "btn-ghost", "text-error", 3, "click"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "fill",
        "none",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-6",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
      ],
    ],
    template: function (n, r) {
      if (
        (n & 1 &&
          (h(0, "div", 0)(1, "div", 1)(2, "div", 2),
          ge(3, EA, 2, 3, "button", 3, rt),
          m(),
          P(5, DA, 1, 5, "app-paginator", 4),
          m()(),
          h(6, "div", 5)(7, "table", 6)(8, "thead")(9, "tr")(10, "th", 7),
          y(11, "Sender / Recipient"),
          m(),
          h(12, "th", 8),
          y(13, "Message"),
          m(),
          h(14, "th", 7),
          y(15, "Date"),
          m(),
          U(16, "th", 9),
          m()(),
          h(17, "tbody"),
          ge(18, wA, 16, 12, "tr", 10, CA),
          m()()()),
        n & 2)
      ) {
        let o, i;
        v(3),
          ve(r.tabs),
          v(2),
          F(
            (o = (o = r.paginatedMessages()) == null ? null : o.metadata)
              ? 5
              : -1,
            o
          ),
          v(13),
          ve((i = r.paginatedMessages()) == null ? null : i.items);
      }
    },
    dependencies: [Gr, un, So],
    encapsulation: 2,
  });
};
var gC = () => {
  let e = f(_e),
    t = f(Ot);
  return e.currentUser() ? !0 : (t.error("You shall not pass"), !1);
};
function IA(e, t) {
  if ((e & 1 && (A(0, "li"), y(1), R()), e & 2)) {
    let n = t.$implicit;
    v(), oe(n);
  }
}
function SA(e, t) {
  if (
    (e & 1 &&
      (A(0, "div", 6)(1, "ul", 7), ge(2, IA, 2, 1, "li", null, rt), R()()),
    e & 2)
  ) {
    let n = E();
    v(2), ve(n.validationErrors());
  }
}
var dd = class e {
  http = f(At);
  baseUrl = it.apiUrl;
  validationErrors = j([]);
  get404Error() {
    this.http
      .get(this.baseUrl + "buggy/not-found")
      .subscribe({ next: (t) => console.log(t), error: (t) => console.log(t) });
  }
  get400Error() {
    this.http
      .get(this.baseUrl + "buggy/bad-request")
      .subscribe({ next: (t) => console.log(t), error: (t) => console.log(t) });
  }
  get500Error() {
    this.http
      .get(this.baseUrl + "buggy/server-error")
      .subscribe({ next: (t) => console.log(t), error: (t) => console.log(t) });
  }
  get401Error() {
    this.http
      .get(this.baseUrl + "buggy/auth")
      .subscribe({ next: (t) => console.log(t), error: (t) => console.log(t) });
  }
  get400ValidationError() {
    this.http.post(this.baseUrl + "account/register", {}).subscribe({
      next: (t) => console.log(t),
      error: (t) => {
        console.log(t), this.validationErrors.set(t);
      },
    });
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-test-errors"]],
    decls: 12,
    vars: 1,
    consts: [
      [1, "flex", "justify-center", "gap-3", "pt-10"],
      [1, "btn", "btn-neutral", 3, "click"],
      [1, "btn", "btn-accent", 3, "click"],
      [1, "btn", "btn-secondary", 3, "click"],
      [1, "btn", "btn-success", 3, "click"],
      [1, "btn", "btn-info", 3, "click"],
      [
        1,
        "card",
        "bg-base-100",
        "flex",
        "mt-5",
        "rounded-2xl",
        "w-1/2",
        "p-3",
        "mx-auto",
      ],
      [1, "flex", "flex-col", "text-red-600", "space-y-2"],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "div", 0)(1, "button", 1),
        ie("click", function () {
          return r.get500Error();
        }),
        y(2, "Test 500 Error"),
        R(),
        A(3, "button", 2),
        ie("click", function () {
          return r.get400Error();
        }),
        y(4, "Test 400 Error"),
        R(),
        A(5, "button", 3),
        ie("click", function () {
          return r.get401Error();
        }),
        y(6, "Test 401 Error"),
        R(),
        A(7, "button", 4),
        ie("click", function () {
          return r.get404Error();
        }),
        y(8, "Test 404 Error"),
        R(),
        A(9, "button", 5),
        ie("click", function () {
          return r.get400ValidationError();
        }),
        y(10, "Test 400 Validation Error"),
        R()(),
        P(11, SA, 4, 0, "div", 6)),
        n & 2 && (v(11), F(r.validationErrors().length > 0 ? 11 : -1));
    },
    encapsulation: 2,
  });
};
var fd = class e {
  location = f(Pr);
  goBack() {
    this.location.back();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-not-found"]],
    decls: 9,
    vars: 0,
    consts: [
      [
        1,
        "card",
        "bg-base-100",
        "gap-3",
        "w-4xl",
        "mx-auto",
        "flex",
        "flex-col",
        "items-center",
        "rounded-xl",
        "shadow-xl",
        "p-10",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "fill",
        "none",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-32",
        "text-error",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
      ],
      [1, "card-title", "text-4xl", "justify-center"],
      [1, "card-body", "text-xl", "text-center"],
      [1, "btn", "btn-primary", 3, "click"],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "div", 0),
        ke(),
        A(1, "svg", 1),
        xt(2, "path", 2),
        R(),
        vt(),
        A(3, "h1", 3),
        y(4, "Not found"),
        R(),
        A(5, "p", 4),
        y(6, "Sorry, what you are looking for cannot be found"),
        R(),
        A(7, "button", 5),
        ie("click", function () {
          return r.goBack();
        }),
        y(8, "Go back"),
        R()());
    },
    encapsulation: 2,
  });
};
function MA(e, t) {
  if ((e & 1 && (A(0, "div"), y(1), R()), e & 2)) {
    let n = E();
    v(), oe(n.error.details);
  }
}
var pd = class e {
  error;
  router = f(Ne);
  showDetails = !1;
  constructor() {
    let t = this.router.getCurrentNavigation();
    this.error = t?.extras?.state?.error;
  }
  detailsToggle() {
    this.showDetails = !this.showDetails;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-server-error"]],
    decls: 10,
    vars: 2,
    consts: [
      [
        1,
        "card",
        "bg-base-100",
        "gap-3",
        "w-4xl",
        "mx-auto",
        "flex",
        "flex-col",
        "items-center",
        "rounded-xl",
        "shadow-xl",
        "p-10",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "fill",
        "none",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-32",
        "text-error",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082",
      ],
      [1, "card-title", "text-4xl", "justify-center"],
      [1, "card-body", "text-xl", "text-center"],
      [1, "btn", "btn-primary", 3, "click"],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "div", 0),
        ke(),
        A(1, "svg", 1),
        xt(2, "path", 2),
        R(),
        vt(),
        A(3, "h1", 3),
        y(4, "Server error"),
        R(),
        A(5, "p", 4),
        y(6),
        R(),
        A(7, "button", 5),
        ie("click", function () {
          return r.detailsToggle();
        }),
        y(8, "Details"),
        R(),
        P(9, MA, 2, 1, "div"),
        R()),
        n & 2 && (v(6), oe(r.error.message), v(3), F(r.showDetails ? 9 : -1));
    },
    encapsulation: 2,
  });
};
var Yi = class e {
  transform(t) {
    if (t) {
      let n = Math.floor((+new Date() - +new Date(t)) / 1e3);
      if (n < 29) return "Just now";
      let r = {
          year: 31536e3,
          month: 2592e3,
          week: 604800,
          day: 86400,
          hour: 3600,
          minute: 60,
          second: 1,
        },
        o;
      for (let i in r)
        if (((o = Math.floor(n / r[i])), o > 0))
          return o === 1 ? o + " " + i + " ago" : o + " " + i + "s ago";
    }
    return t;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵpipe = Do({ name: "timeAgo", type: e, pure: !0 });
};
var TA = ["editForm"];
function xA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "form", 6, 0),
      O("ngSubmit", function () {
        I(n);
        let o = E(2);
        return S(o.updateProfile());
      }),
      h(2, "label", 7)(3, "span"),
      y(4, "Display Name"),
      m(),
      h(5, "input", 8),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E(2);
        return (
          ot(i.editableMember.displayName, o) ||
            (i.editableMember.displayName = o),
          S(o)
        );
      }),
      m()(),
      h(6, "label", 7)(7, "span"),
      y(8, "Description"),
      m(),
      h(9, "textarea", 9),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E(2);
        return (
          ot(i.editableMember.description, o) ||
            (i.editableMember.description = o),
          S(o)
        );
      }),
      m()(),
      h(10, "label", 7)(11, "span"),
      y(12, "City"),
      m(),
      h(13, "input", 10),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E(2);
        return (
          ot(i.editableMember.city, o) || (i.editableMember.city = o), S(o)
        );
      }),
      m()(),
      h(14, "label", 7)(15, "span"),
      y(16, "Country"),
      m(),
      h(17, "input", 11),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E(2);
        return (
          ot(i.editableMember.country, o) || (i.editableMember.country = o),
          S(o)
        );
      }),
      m()(),
      h(18, "div", 12)(19, "button", 13),
      y(20, " Submit "),
      m()()();
  }
  if (e & 2) {
    let n = Ah(1),
      r = E(2);
    v(5),
      Ye("ngModel", r.editableMember.displayName),
      v(4),
      Ye("ngModel", r.editableMember.description),
      v(4),
      Ye("ngModel", r.editableMember.city),
      v(4),
      Ye("ngModel", r.editableMember.country),
      v(2),
      Z("disabled", !n.dirty);
  }
}
function NA(e, t) {
  if ((e & 1 && (h(0, "div"), y(1), m()), e & 2)) {
    let n = E();
    v(), oe(n.description || "No description provided yet...");
  }
}
function AA(e, t) {
  if (
    (e & 1 &&
      (h(0, "div", 1)(1, "div", 2)(2, "span", 3),
      y(3, "Member since:"),
      m(),
      h(4, "span"),
      y(5),
      Gt(6, "date"),
      m()(),
      h(7, "div", 2)(8, "span", 3),
      y(9, "Last active:"),
      m(),
      h(10, "span"),
      y(11),
      Gt(12, "timeAgo"),
      m()(),
      h(13, "h3", 4),
      y(14),
      m(),
      P(15, xA, 21, 5, "form", 5)(16, NA, 2, 1, "div"),
      m()),
    e & 2)
  ) {
    let n = t,
      r = E();
    v(5),
      oe(Io(6, 4, n.created, "longDate")),
      v(6),
      oe(lr(12, 7, n.lastActive)),
      v(3),
      Ce(" About ", n.displayName, " "),
      v(),
      F(r.memberService.editMode() ? 15 : 16);
  }
}
var hd = class e {
  editForm;
  notify(t) {
    this.editForm?.dirty && t.preventDefault();
  }
  accountService = f(_e);
  memberService = f(Pt);
  toast = f(Ot);
  editableMember = { displayName: "", description: "", city: "", country: "" };
  ngOnInit() {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || "",
      description: this.memberService.member()?.description || "",
      city: this.memberService.member()?.city || "",
      country: this.memberService.member()?.country || "",
    };
  }
  updateProfile() {
    if (!this.memberService.member()) return;
    let t = b(b({}, this.memberService.member()), this.editableMember);
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        let n = this.accountService.currentUser();
        n &&
          t.displayName !== n?.displayName &&
          ((n.displayName = t.displayName),
          this.accountService.setCurrentUser(n)),
          this.toast.success("Profile updated successfully"),
          this.memberService.editMode.set(!1),
          this.memberService.member.set(t),
          this.editForm?.reset(t);
      },
    });
  }
  ngOnDestroy() {
    this.memberService.editMode() && this.memberService.editMode.set(!1);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-profile"]],
    viewQuery: function (n, r) {
      if ((n & 1 && $t(TA, 5), n & 2)) {
        let o;
        Ct((o = Et())) && (r.editForm = o.first);
      }
    },
    hostBindings: function (n, r) {
      n & 1 &&
        O(
          "beforeunload",
          function (i) {
            return r.notify(i);
          },
          th
        );
    },
    decls: 1,
    vars: 1,
    consts: [
      ["editForm", "ngForm"],
      [1, "flex", "flex-col", "gap-3"],
      [1, "flex", "gap-3"],
      [1, "font-semibold"],
      [1, "text-lg", "font-semibold", "text-primary"],
      [1, "flex", "flex-col", "w-full", "gap-4"],
      [1, "flex", "flex-col", "w-full", "gap-4", 3, "ngSubmit"],
      [1, "floating-label"],
      [
        "name",
        "displayName",
        "placeholder",
        "Display name",
        1,
        "input",
        "w-full",
        3,
        "ngModelChange",
        "ngModel",
      ],
      [
        "name",
        "description",
        "placeholder",
        "Description",
        1,
        "textarea",
        "w-full",
        3,
        "ngModelChange",
        "ngModel",
      ],
      [
        "name",
        "city",
        "placeholder",
        "City",
        1,
        "input",
        "w-full",
        3,
        "ngModelChange",
        "ngModel",
      ],
      [
        "name",
        "country",
        "placeholder",
        "Country",
        1,
        "input",
        "w-full",
        3,
        "ngModelChange",
        "ngModel",
      ],
      [1, "flex", "self-end"],
      ["type", "submit", 1, "btn", "btn-success", 3, "disabled"],
    ],
    template: function (n, r) {
      if ((n & 1 && P(0, AA, 17, 9, "div", 1), n & 2)) {
        let o;
        F((o = r.memberService.member()) ? 0 : -1, o);
      }
    },
    dependencies: [Gn, Hr, kt, fn, Br, mr, Fo, So, Yi],
    encapsulation: 2,
  });
};
function RA(e, t) {
  e & 1 && xt(0, "span", 11);
}
function kA(e, t) {
  if (e & 1) {
    let n = Y();
    A(0, "div", 5)(1, "div", 6),
      xt(2, "img", 7),
      R(),
      A(3, "div", 8)(4, "button", 9),
      ie("click", function () {
        I(n);
        let o = E();
        return S(o.onCancel());
      }),
      y(5, "Cancel"),
      R(),
      A(6, "button", 10),
      ie("click", function () {
        I(n);
        let o = E();
        return S(o.onUploadFile());
      }),
      P(7, RA, 1, 0, "span", 11),
      y(8, " Upload image "),
      R()()();
  }
  if (e & 2) {
    let n = E();
    v(2),
      bt("src", Dn(n.imageSrc()), ft),
      v(4),
      bt("disabled", n.loading()),
      v(),
      F(n.loading() ? 7 : -1);
  }
}
var md = class e {
  imageSrc = j(null);
  isDragging = !1;
  fileToUpload = null;
  uploadFile = Wt();
  loading = Le(!1);
  onDragOver(t) {
    t.preventDefault(), t.stopPropagation(), (this.isDragging = !0);
  }
  onDragLeave(t) {
    t.preventDefault(), t.stopPropagation(), (this.isDragging = !1);
  }
  onDrop(t) {
    if (
      (t.preventDefault(),
      t.stopPropagation(),
      (this.isDragging = !1),
      t.dataTransfer?.files.length)
    ) {
      let n = t.dataTransfer.files[0];
      this.previewImage(n), (this.fileToUpload = n);
    }
  }
  onCancel() {
    (this.fileToUpload = null), this.imageSrc.set(null);
  }
  onUploadFile() {
    this.fileToUpload && this.uploadFile.emit(this.fileToUpload);
  }
  previewImage(t) {
    let n = new FileReader();
    (n.onload = (r) => this.imageSrc.set(r.target?.result)), n.readAsDataURL(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-image-upload"]],
    inputs: { loading: [1, "loading"] },
    outputs: { uploadFile: "uploadFile" },
    decls: 7,
    vars: 7,
    consts: [
      [1, "flex", "w-full", "gap-6", "min-h-100"],
      [1, "flex", "items-center", "gap-4", "w-2/3"],
      [
        "for",
        "dropzone-file",
        1,
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "w-full",
        "border-2",
        "border-gray-300",
        "h-full",
        "border-dashed",
        "rounded-lg",
        "cursor-pointer",
        3,
        "dragover",
        "dragleave",
        "drop",
      ],
      [1, "mb-2", "text-lg"],
      ["type", "file", "id", "dropzone-file", 1, "hidden"],
      [1, "flex", "flex-col", "w-1/3", "gap-3"],
      [
        1,
        "flex",
        "justify-center",
        "border-2",
        "border-gray-300",
        "rounded-lg",
      ],
      [
        "alt",
        "image preview",
        1,
        "aspect-square",
        "object-cover",
        "rounded-lg",
        3,
        "src",
      ],
      [1, "flex", "w-full", "gap-3"],
      [1, "btn", "flex-1", 3, "click"],
      [1, "btn", "btn-primary", "flex-1", 3, "click", "disabled"],
      [1, "loading", "loading-spinner"],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "div", 0)(1, "div", 1)(2, "label", 2),
        ie("dragover", function (i) {
          return r.onDragOver(i);
        })("dragleave", function (i) {
          return r.onDragLeave(i);
        })("drop", function (i) {
          return r.onDrop(i);
        }),
        A(3, "p", 3),
        y(4, "Click to upload or drag and drop"),
        R(),
        xt(5, "input", 4),
        R()(),
        P(6, kA, 9, 4, "div", 5),
        R()),
        n & 2 &&
          (v(2),
          fe("border-purple-600", r.isDragging)("border-4", r.isDragging)(
            "bg-purple-100",
            r.isDragging
          ),
          v(4),
          F(r.imageSrc() ? 6 : -1));
    },
    encapsulation: 2,
  });
};
var gd = class e {
  disabled = Le();
  selected = Le();
  clickEvent = Wt();
  onClick(t) {
    this.clickEvent.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-star-button"]],
    inputs: { disabled: [1, "disabled"], selected: [1, "selected"] },
    outputs: { clickEvent: "clickEvent" },
    decls: 3,
    vars: 6,
    consts: [
      [1, "z-50", "cursor-pointer", 3, "click", "disabled"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-8",
        "stroke-2",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "button", 0),
        ie("click", function (i) {
          return r.onClick(i);
        }),
        ke(),
        A(1, "svg", 1),
        xt(2, "path", 2),
        R()()),
        n & 2 &&
          (bt("disabled", r.disabled()),
          v(),
          fe("text-yellow-200", r.selected())("stroke-white", r.selected()),
          an("fill", r.selected() ? "currentColor" : "none"));
    },
    encapsulation: 2,
  });
};
var vd = class e {
  disabled = Le();
  clickEvent = Wt();
  onClick(t) {
    this.clickEvent.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-delete-button"]],
    inputs: { disabled: [1, "disabled"] },
    outputs: { clickEvent: "clickEvent" },
    decls: 3,
    vars: 3,
    consts: [
      [1, "z-50", "cursor-pointer", 3, "click", "disabled"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "fill",
        "none",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-8",
        "text-error",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (A(0, "button", 0),
        ie("click", function (i) {
          return r.onClick(i);
        }),
        ke(),
        A(1, "svg", 1),
        xt(2, "path", 2),
        R()()),
        n & 2 &&
          (bt("disabled", r.disabled()), v(), fe("opacity-25", r.disabled()));
    },
    encapsulation: 2,
  });
};
var OA = (e, t) => t.id;
function PA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "app-star-button", 5),
      O("clickEvent", function () {
        I(n);
        let o = E().$implicit,
          i = E(4);
        return S(i.setMainPhoto(o));
      }),
      m(),
      h(1, "app-delete-button", 6),
      O("clickEvent", function () {
        I(n);
        let o = E().$implicit,
          i = E(4);
        return S(i.deletePhoto(o.id));
      }),
      m();
  }
  if (e & 2) {
    let n,
      r,
      o,
      i = E().$implicit,
      s = E(4);
    Z(
      "disabled",
      i.url === ((n = s.memberService.member()) == null ? null : n.imageUrl)
    )(
      "selected",
      i.url === ((r = s.memberService.member()) == null ? null : r.imageUrl)
    ),
      v(),
      Z(
        "disabled",
        i.url === ((o = s.memberService.member()) == null ? null : o.imageUrl)
      );
  }
}
function FA(e, t) {
  if ((e & 1 && (h(0, "div", 3), U(1, "img", 4), P(2, PA, 2, 3), m()), e & 2)) {
    let n,
      r = t.$implicit,
      o = E(4);
    v(),
      Z("src", Dn(r.url), ft),
      v(),
      F(
        ((n = o.accountService.currentUser()) == null ? null : n.id) ===
          ((n = o.memberService.member()) == null ? null : n.id)
          ? 2
          : -1
      );
  }
}
function LA(e, t) {
  if ((e & 1 && (h(0, "div", 1), ge(1, FA, 3, 3, "div", 3, OA), m()), e & 2)) {
    let n = E();
    v(), ve(n);
  }
}
function VA(e, t) {
  e & 1 && (h(0, "p", 2), y(1, "No photos available"), m());
}
function jA(e, t) {
  e & 1 && P(0, LA, 3, 0, "div", 1)(1, VA, 2, 0, "p", 2),
    e & 2 && F(t.length > 0 ? 0 : 1);
}
function UA(e, t) {
  if ((e & 1 && P(0, jA, 2, 1), e & 2)) {
    let n,
      r = E();
    F((n = r.photos()) ? 0 : -1, n);
  }
}
function BA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "app-image-upload", 7),
      O("uploadFile", function (o) {
        I(n);
        let i = E();
        return S(i.onUploadImage(o));
      }),
      m();
  }
  if (e & 2) {
    let n = E();
    Z("loading", n.loading());
  }
}
var yd = class e {
  memberService = f(Pt);
  accountService = f(_e);
  route = f(St);
  photos = j([]);
  loading = j(!1);
  ngOnInit() {
    let t = this.route.parent?.snapshot.paramMap.get("id");
    t &&
      this.memberService
        .getMemberPhotos(t)
        .subscribe({ next: (n) => this.photos.set(n) });
  }
  onUploadImage(t) {
    this.loading.set(!0),
      this.memberService.uploadPhoto(t).subscribe({
        next: (n) => {
          this.memberService.editMode.set(!1),
            this.loading.set(!1),
            this.photos.update((r) => [...r, n]),
            this.memberService.member()?.imageUrl || this.setMainLocalPhoto(n);
        },
        error: (n) => {
          console.log("Error uploading image: ", n), this.loading.set(!1);
        },
      });
  }
  setMainPhoto(t) {
    this.memberService.setMainPhoto(t).subscribe({
      next: () => {
        this.setMainLocalPhoto(t);
      },
    });
  }
  deletePhoto(t) {
    this.memberService.deletePhoto(t).subscribe({
      next: () => {
        this.photos.update((n) => n.filter((r) => r.id !== t));
      },
    });
  }
  setMainLocalPhoto(t) {
    let n = this.accountService.currentUser();
    n && (n.imageUrl = t.url),
      this.accountService.setCurrentUser(n),
      this.memberService.member.update((r) => B(b({}, r), { imageUrl: t.url }));
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-photos"]],
    decls: 2,
    vars: 1,
    consts: [
      [3, "loading"],
      [
        1,
        "grid",
        "grid-cols-4",
        "auto-rows-min",
        "gap-3",
        "p-5",
        "h-[65vh]",
        "overflow-auto",
      ],
      [1, "text-center", "text-gray-500"],
      [1, "relative"],
      ["alt", "photo of member", 1, "w-full", "rounded-lg", 3, "src"],
      [
        1,
        "absolute",
        "top-1",
        "right-1",
        3,
        "clickEvent",
        "disabled",
        "selected",
      ],
      [1, "absolute", "top-1", "left-1", 3, "clickEvent", "disabled"],
      [3, "uploadFile", "loading"],
    ],
    template: function (n, r) {
      n & 1 && P(0, UA, 1, 1)(1, BA, 1, 1, "app-image-upload", 0),
        n & 2 && F(r.memberService.editMode() ? 1 : 0);
    },
    dependencies: [md, gd, vd],
    encapsulation: 2,
  });
};
var HA = ["messageEndRef"],
  $A = (e, t) => t.id;
function zA(e, t) {
  if ((e & 1 && (h(0, "div", 14), y(1), Gt(2, "timeAgo"), m()), e & 2)) {
    let n = E().$implicit;
    v(), Ce(" Seen ", lr(2, 1, n.dateRead), " ");
  }
}
function GA(e, t) {
  e & 1 && (h(0, "div", 14), y(1, "Not Read"), m());
}
function WA(e, t) {
  e & 1 && (h(0, "div", 14), y(1, "Deliverd"), m());
}
function qA(e, t) {
  if (
    (e & 1 &&
      (h(0, "div", 7)(1, "div", 8)(2, "div", 9),
      U(3, "img", 10),
      m()(),
      h(4, "div", 11),
      y(5),
      h(6, "time", 12),
      y(7),
      Gt(8, "date"),
      m()(),
      h(9, "div", 13),
      y(10),
      m(),
      P(11, zA, 3, 3, "div", 14)(12, GA, 2, 0, "div", 14)(
        13,
        WA,
        2,
        0,
        "div",
        14
      ),
      m()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = E();
    fe("chat-start", !n.currentUserSender)("chat-end", n.currentUserSender),
      v(),
      fe(
        "avatar-online",
        r.presenceService.onlineUsers().includes(n.senderId || n.recipientId)
      ),
      v(2),
      Z("src", n.senderImageUrl || "/user.png", ft),
      v(2),
      Ce(" ", n.senderDisplayName, " "),
      v(2),
      oe(Io(8, 11, n.messageSent, "short")),
      v(3),
      oe(n.content),
      v(),
      F(
        n.currentUserSender && n.dateRead
          ? 11
          : n.currentUserSender && !n.dateRead
          ? 12
          : 13
      );
  }
}
var _d = class e {
  messageEndRef;
  messageService = f(qi);
  memberService = f(Pt);
  presenceService = f(Qn);
  route = f(St);
  messageContent = "";
  constructor() {
    Lh(() => {
      this.messageService.messageThread().length > 0 && this.scrollToBotom();
    });
  }
  ngOnInit() {
    this.route.parent?.paramMap.subscribe({
      next: (t) => {
        let n = t.get("id");
        if (!n) throw new Error("Cannot connect to hub");
        this.messageService.createHubConnection(n);
      },
    });
  }
  sendMessage() {
    let t = this.memberService.member()?.id;
    t &&
      this.messageService.sendMessage(t, this.messageContent)?.then(() => {
        this.messageContent = "";
      });
  }
  scrollToBotom() {
    setTimeout(() => {
      this.messageEndRef &&
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: "smooth" });
    });
  }
  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-member-messages"]],
    viewQuery: function (n, r) {
      if ((n & 1 && $t(HA, 5), n & 2)) {
        let o;
        Ct((o = Et())) && (r.messageEndRef = o.first);
      }
    },
    decls: 10,
    vars: 1,
    consts: [
      ["messageEndRef", ""],
      [1, "flex", "flex-col", "w-full", "h-[72vh]"],
      [1, "flex", "flex-col", "flex-grow", "overflow-auto"],
      [1, "chat", 3, "chat-start", "chat-end"],
      [1, "flex", "join", "w-full"],
      [
        "placeholder",
        "Enter your messaage...",
        1,
        "input",
        "w-full",
        3,
        "ngModelChange",
        "keydown.enter",
        "ngModel",
      ],
      ["type", "submit", 1, "btn", "btn-primary", "join-item", 3, "click"],
      [1, "chat"],
      [1, "chat-image", "avatar"],
      [1, "w-10", "rounded-full"],
      ["alt", "image of user", 3, "src"],
      [1, "chat-header"],
      [1, "text-xs", "opacity-50"],
      [1, "chat-bubble"],
      [1, "chat-footer", "opacity-50"],
    ],
    template: function (n, r) {
      if (n & 1) {
        let o = Y();
        h(0, "div", 1)(1, "div", 2),
          ge(2, qA, 14, 14, "div", 3, $A),
          U(4, "div", null, 0),
          m(),
          h(6, "div", 4)(7, "input", 5),
          Qe("ngModelChange", function (s) {
            return (
              I(o), ot(r.messageContent, s) || (r.messageContent = s), S(s)
            );
          }),
          O("keydown.enter", function () {
            return I(o), S(r.sendMessage());
          }),
          m(),
          h(8, "button", 6),
          O("click", function () {
            return I(o), S(r.sendMessage());
          }),
          y(9, " Send "),
          m()()();
      }
      n & 2 &&
        (v(2),
        ve(r.messageService.messageThread()),
        v(5),
        Ye("ngModel", r.messageContent));
    },
    dependencies: [Gn, kt, fn, mr, So, Yi],
    encapsulation: 2,
  });
};
var vC = (e, t) => {
  let n = f(Pt),
    r = f(Ne),
    o = e.paramMap.get("id");
  return o ? n.getMember(o) : (r.navigateByUrl("/not-found"), lt);
};
var yC = (e) =>
  e.editForm?.dirty
    ? confirm(
        "Are you sure you want to continue? All unsaved changes will be lost"
      )
    : !0;
var bd = class e {
  baseUrl = it.apiUrl;
  http = f(At);
  getUserWithRoles() {
    return this.http.get(this.baseUrl + "admin/users-with-roles");
  }
  updateUserRoles(t, n) {
    return this.http.post(
      this.baseUrl + "admin/edit-roles/" + t + "?roles=" + n,
      {}
    );
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var ZA = ["rolesModal"],
  YA = (e, t) => t.id;
function QA(e, t) {
  if (e & 1) {
    let n = Y();
    A(0, "tr")(1, "td"),
      y(2),
      R(),
      A(3, "td"),
      y(4),
      R(),
      A(5, "td")(6, "button", 10),
      ie("click", function () {
        let o = I(n).$implicit,
          i = E();
        return S(i.openRolesModal(o));
      }),
      y(7, " Edit roles "),
      R()()();
  }
  if (e & 2) {
    let n = t.$implicit;
    v(2), oe(n.email), v(2), oe(n.roles);
  }
}
function KA(e, t) {
  if (e & 1) {
    let n = Y();
    A(0, "label", 8)(1, "input", 12),
      ie("change", function (o) {
        let i = I(n).$implicit,
          s = E();
        return S(s.toggleRole(o, i));
      }),
      R(),
      y(2),
      R();
  }
  if (e & 2) {
    let n = t.$implicit,
      r = E();
    v(),
      bt(
        "checked",
        r.selectedUser == null || r.selectedUser.roles == null
          ? null
          : r.selectedUser.roles.includes(n)
      )(
        "disabled",
        (r.selectedUser == null ? null : r.selectedUser.email) ===
          "admin@test.com" && n === "Admin"
      ),
      v(),
      Ce(" ", n, " ");
  }
}
var Cd = class e {
  rolesModal;
  adminService = f(bd);
  users = j([]);
  availableRoles = ["Member", "Moderator", "Admin"];
  selectedUser = null;
  ngOnInit() {
    this.getUserWithRoles();
  }
  getUserWithRoles() {
    this.adminService
      .getUserWithRoles()
      .subscribe({ next: (t) => this.users.set(t) });
  }
  openRolesModal(t) {
    (this.selectedUser = t), this.rolesModal.nativeElement.showModal();
  }
  toggleRole(t, n) {
    if (!this.selectedUser) return;
    t.target.checked
      ? this.selectedUser.roles.push(n)
      : (this.selectedUser.roles = this.selectedUser.roles.filter(
          (o) => o !== n
        ));
  }
  updateRoles() {
    this.selectedUser &&
      this.adminService
        .updateUserRoles(this.selectedUser.id, this.selectedUser.roles)
        .subscribe({
          next: (t) => {
            this.users.update((n) =>
              n.map((r) => (r.id === this.selectedUser?.id && (r.roles = t), r))
            ),
              this.rolesModal.nativeElement.close();
          },
          error: (t) => console.log("Failed to update roles", t),
        });
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-user-management"]],
    viewQuery: function (n, r) {
      if ((n & 1 && $t(ZA, 5), n & 2)) {
        let o;
        Ct((o = Et())) && (r.rolesModal = o.first);
      }
    },
    decls: 29,
    vars: 1,
    consts: [
      ["rolesModal", ""],
      [
        1,
        "h-[75vh]",
        "overflow-auto",
        "rounded-box",
        "border",
        "border-base-content/5",
        "bg-base-100",
      ],
      [1, "table"],
      [1, "modal"],
      [1, "modal-box"],
      [1, "text-lg", "font-bold"],
      [
        1,
        "fieldset",
        "w-full",
        "p-4",
        "bg-base-100",
        "border",
        "border-base-300",
        "rounded-box",
      ],
      [1, "fieldset-legend"],
      [1, "fieldset-label"],
      [1, "modal-action"],
      [1, "btn", "btn-primary", 3, "click"],
      ["method", "dialog", 1, "modal-backdrop"],
      ["type", "checkbox", 1, "checkbox", 3, "change", "checked", "disabled"],
    ],
    template: function (n, r) {
      if (n & 1) {
        let o = Y();
        A(0, "div", 1)(1, "table", 2)(2, "thead")(3, "tr")(4, "th"),
          y(5, "Email"),
          R(),
          A(6, "th"),
          y(7, "Active roles"),
          R(),
          A(8, "th"),
          y(9, "Action"),
          R()()(),
          A(10, "tbody"),
          ge(11, QA, 8, 2, "tr", null, YA),
          R()()(),
          A(13, "dialog", 3, 0)(15, "div", 4)(16, "h3", 5),
          y(17),
          R(),
          A(18, "fieldset", 6)(19, "legend", 7),
          y(20, "Selcet roles"),
          R(),
          ge(21, KA, 3, 3, "label", 8, rt),
          R(),
          A(23, "div", 9)(24, "button", 10),
          ie("click", function () {
            return I(o), S(r.updateRoles());
          }),
          y(25, "Submit"),
          R()()(),
          A(26, "form", 11)(27, "button"),
          y(28, "Close"),
          R()()();
      }
      n & 2 &&
        (v(11),
        ve(r.users()),
        v(6),
        Ce(
          "Edit roles for ",
          r.selectedUser == null ? null : r.selectedUser.email
        ),
        v(4),
        ve(r.availableRoles));
    },
    encapsulation: 2,
  });
};
var Ed = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-photo-management"]],
    decls: 2,
    vars: 0,
    template: function (n, r) {
      n & 1 && (A(0, "p"), y(1, "photo-management works!"), R());
    },
    encapsulation: 2,
  });
};
function JA(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "button", 4),
      O("click", function () {
        let o = I(n).$implicit,
          i = E();
        return S(i.setTab(o.value));
      }),
      y(1),
      m();
  }
  if (e & 2) {
    let n,
      r = t.$implicit,
      o = E();
    fe("tab-active", o.activeTab === r.value),
      Z(
        "hidden",
        r.value === "roles" &&
          !(
            !(
              (n = o.accountService.currentUser()) == null || n.roles == null
            ) && n.roles.includes("Admin")
          )
      ),
      v(),
      Ce(" ", r.label, " ");
  }
}
function XA(e, t) {
  e & 1 && U(0, "app-user-management");
}
function eR(e, t) {
  e & 1 && U(0, "app-photo-management");
}
var Dd = class e {
  accountService = f(_e);
  activeTab = "photos";
  tabs = [
    { label: "Photo moderation", value: "photos" },
    { label: "User management", value: "roles" },
  ];
  setTab(t) {
    this.activeTab = t;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-admin"]],
    decls: 7,
    vars: 2,
    consts: [
      [1, "flex", "flex-col", "w-full", "mb-3"],
      [1, "flex", "justify-between", "items-center"],
      [1, "tabs", "tabs-border", "tabs-lg", "text-primary"],
      [1, "tab", 3, "hidden", "tab-active"],
      [1, "tab", 3, "click", "hidden"],
    ],
    template: function (n, r) {
      n & 1 &&
        (h(0, "div", 0)(1, "div", 1)(2, "div", 2),
        ge(3, JA, 2, 4, "button", 3, rt),
        m()()(),
        P(5, XA, 1, 0, "app-user-management"),
        P(6, eR, 1, 0, "app-photo-management")),
        n & 2 &&
          (v(3),
          ve(r.tabs),
          v(2),
          F(r.activeTab === "roles" ? 5 : -1),
          v(),
          F(r.activeTab === "photos" ? 6 : -1));
    },
    dependencies: [Cd, Ed],
    encapsulation: 2,
  });
};
var _C = (e, t) => {
  let n = f(_e),
    r = f(Ot);
  return n.currentUser()?.roles.includes("Admin") ||
    n.currentUser()?.roles.includes("Moderator")
    ? !0
    : (r.error("Enter this area,you cannot"), !1);
};
var bC = [
  { path: "", component: id },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [gC],
    children: [
      { path: "members", component: ad },
      {
        path: "members/:id",
        resolve: { member: vC },
        runGuardsAndResolvers: "always",
        component: cd,
        children: [
          { path: "", redirectTo: "profile", pathMatch: "full" },
          {
            path: "profile",
            component: hd,
            title: "Profile",
            canDeactivate: [yC],
          },
          { path: "photos", component: yd, title: "Photos" },
          { path: "messages", component: _d, title: "Messages" },
        ],
      },
      { path: "lists", component: ld },
      { path: "messages", component: ud },
      { path: "admin", component: Dd, canActivate: [_C] },
    ],
  },
  { path: "errors", component: dd },
  { path: "server-error", component: pd },
  { path: "**", component: fd },
];
var wd = class e {
  accountService = f(_e);
  init() {
    return this.accountService.refreshToken().pipe(
      le((t) => {
        t &&
          (this.accountService.setCurrentUser(t),
          this.accountService.startTokenRefreshInterval());
      })
    );
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var CC = (e, t) => {
  let n = f(Ot),
    r = f(Ne);
  return t(e).pipe(
    Jt((o) => {
      if (o)
        switch (o.status) {
          case 400:
            if (o.error.errors) {
              let s = [];
              for (let a in o.error.errors)
                o.error.errors[a] && s.push(o.error.errors[a]);
              throw s.flat();
            } else n.error(o.error);
            break;
          case 401:
            n.error("Unauthorized");
            break;
          case 404:
            r.navigateByUrl("/not-found");
            break;
          case 500:
            let i = { state: { error: o.error } };
            r.navigateByUrl("/server-error", i);
            break;
          default:
            n.error("Something went wrong");
            break;
        }
      throw o;
    })
  );
};
var EC = (e, t) => {
  let r = f(_e).currentUser();
  return (
    r && (e = e.clone({ setHeaders: { Authorization: `Bearer ${r.token}` } })),
    t(e)
  );
};
var Qi = class e {
  busyRequestCount = j(0);
  busy() {
    this.busyRequestCount.update((t) => t + 1);
  }
  idle() {
    this.busyRequestCount.update((t) => Math.max(0, t - 1));
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var ka = new Map(),
  DC = (e, t) => {
    let n = f(Qi),
      r = (s, a) => {
        let c = a
          .keys()
          .map((l) => `${l}=${a.get(l)}`)
          .join("&");
        return c ? `${s}?${c}` : s;
      },
      o = (s) => {
        for (let a of ka.keys())
          a.includes(s) &&
            (ka.delete(a), console.log(`Cache invalidated for: ${a}`));
      },
      i = r(e.url, e.params);
    if (
      (e.method.includes("POST") && e.url.includes("/likes") && o("/likes"),
      e.method.includes("POST") &&
        e.url.includes("/messages") &&
        o("/messages"),
      e.method.includes("POST") && e.url.includes("/logout") && ka.clear(),
      e.method === "GET")
    ) {
      let s = ka.get(i);
      if (s) return V(s);
    }
    return (
      n.busy(),
      t(e).pipe(
        it.production ? ct : Jd(500),
        le((s) => {
          ka.set(i, s);
        }),
        Tn(() => {
          n.idle();
        })
      )
    );
  };
var wC = {
  providers: [
    op(),
    Ph(),
    Nm(bC, Am()),
    rm(om([CC, EC, DC])),
    Rl(async () => {
      let e = f(wd);
      return new Promise((t) => {
        setTimeout(async () => {
          try {
            await Yd(e.init());
          } finally {
            let n = document.getElementById("initial-splash");
            n && n.remove(), t();
          }
        }, 500);
      });
    }),
  ],
};
var IC = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
];
var Id = class e {
  appHasRole = [];
  accountServie = f(_e);
  viewContainerRef = f(ar);
  templateRef = f(Nr);
  ngOnInit() {
    this.accountServie
      .currentUser()
      ?.roles?.some((t) => this.appHasRole.includes(t))
      ? this.viewContainerRef.createEmbeddedView(this.templateRef)
      : this.viewContainerRef.clear();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵdir = de({
    type: e,
    selectors: [["", "appHasRole", ""]],
    inputs: { appHasRole: "appHasRole" },
  });
};
var SC = () => ({ exact: !0 }),
  tR = () => ["Admin", "Moderator"];
function nR(e, t) {
  e & 1 && (h(0, "a", 22), y(1, "Admin"), m());
}
function rR(e, t) {
  e & 1 &&
    (h(0, "a", 18),
    y(1, " Matches "),
    m(),
    h(2, "a", 19),
    y(3, "Lists"),
    m(),
    h(4, "a", 20),
    y(5, "Messages"),
    m(),
    Nl(6, nR, 2, 0, "a", 21)),
    e & 2 &&
      (Z("routerLinkActiveOptions", Ps(2, SC)),
      v(6),
      Z("appHasRole", Ps(3, tR)));
}
function oR(e, t) {
  e & 1 && U(0, "span", 9);
}
function iR(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "li", 23),
      O("click", function () {
        let o = I(n).$implicit,
          i = E();
        return S(i.handleSelectTheme(o));
      }),
      h(1, "a"),
      y(2),
      m()();
  }
  if (e & 2) {
    let n = t.$implicit;
    v(2), oe(n);
  }
}
function sR(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "div", 16)(1, "div", 24),
      U(2, "img", 25),
      h(3, "span"),
      y(4),
      m()(),
      h(5, "ul", 26),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.handleSelectUserItem());
      }),
      h(6, "li")(7, "a", 27),
      y(8, "Edit profile"),
      m()(),
      h(9, "li")(10, "a", 23),
      O("click", function () {
        I(n);
        let o = E();
        return S(o.logout());
      }),
      y(11, "Logout"),
      m()()()();
  }
  if (e & 2) {
    let n = t;
    v(2),
      Z("src", (n == null ? null : n.imageUrl) || "/user.png", ft),
      v(2),
      oe(n.displayName),
      v(3),
      Z("routerLink", Rr("/members/", n.id));
  }
}
function aR(e, t) {
  e & 1 && U(0, "span", 32);
}
function cR(e, t) {
  if (e & 1) {
    let n = Y();
    h(0, "form", 28, 0),
      O("ngSubmit", function () {
        I(n);
        let o = E();
        return S(o.login());
      }),
      h(2, "input", 29),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E();
        return ot(i.creds.email, o) || (i.creds.email = o), S(o);
      }),
      m(),
      h(3, "input", 30),
      Qe("ngModelChange", function (o) {
        I(n);
        let i = E();
        return ot(i.creds.password, o) || (i.creds.password = o), S(o);
      }),
      m(),
      h(4, "button", 31),
      P(5, aR, 1, 0, "span", 32),
      y(6, " Login "),
      m()();
  }
  if (e & 2) {
    let n = E();
    v(2),
      Ye("ngModel", n.creds.email),
      v(),
      Ye("ngModel", n.creds.password),
      v(2),
      F(n.loading() ? 5 : -1);
  }
}
var Sd = class e {
  accountService = f(_e);
  busyService = f(Qi);
  router = f(Ne);
  toast = f(Ot);
  creds = {};
  selectedTheme = j(localStorage.getItem("theme") || "light");
  themes = IC;
  loading = j(!1);
  ngOnInit() {
    document.documentElement.setAttribute("data-theme", this.selectedTheme());
  }
  handleSelectTheme(t) {
    this.selectedTheme.set(t),
      localStorage.setItem("theme", t),
      document.documentElement.setAttribute("data-theme", t);
    let n = document.activeElement;
    n && n.blur();
  }
  handleSelectUserItem() {
    let t = document.activeElement;
    t && t.blur();
  }
  login() {
    this.loading.set(!0),
      this.accountService.login(this.creds).subscribe({
        next: () => {
          this.router.navigateByUrl("/members"),
            this.toast.success("Logged in successfully"),
            (this.creds = {});
        },
        error: (t) => {
          this.toast.error(t.error);
        },
        complete: () => {
          this.loading.set(!1);
        },
      });
  }
  logout() {
    this.accountService.logout(), this.router.navigateByUrl("/");
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-nav"]],
    decls: 23,
    vars: 6,
    consts: [
      ["loginForm", "ngForm"],
      [
        1,
        "p-3",
        "w-full",
        "fixed",
        "top-0",
        "z-50",
        "bg-gradient-to-r",
        "from-primary",
        "to-black",
      ],
      [1, "flex", "align-middle", "items-center", "px-10", "mx-auto", "gap-6"],
      [1, "text-white"],
      [
        "routerLink",
        "/",
        "routerLinkActive",
        "text-accent",
        1,
        "flex",
        "items-center",
        "gap-3",
        "max-h-16",
        "border-r-white",
        "border-r-2",
        "pr-6",
        3,
        "routerLinkActiveOptions",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 24 24",
        "fill",
        "currentColor",
        1,
        "size-7",
      ],
      [
        "d",
        "M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z",
      ],
      [1, "text-2xl", "font-semibold", "uppercase"],
      [1, "flex", "gap-3", "my-2", "uppercase", "text-lg", "text-white"],
      [1, "loading", "loading-spinner", "text-accent"],
      [1, "flex", "align-middle", "ml-auto", "gap-3"],
      [1, "dropdown", "mr-5", "dropdown-end"],
      [
        "tabindex",
        "1",
        1,
        "flex",
        "flex-col",
        "justify-center",
        "align-middle",
        "text-white",
        "cursor-pointer",
        "uppercase",
        "text-xs",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "fill",
        "none",
        "viewBox",
        "0 0 24 24",
        "stroke-width",
        "1.5",
        "stroke",
        "currentColor",
        1,
        "size-6",
        "flex",
        "self-center",
      ],
      [
        "stroke-linecap",
        "round",
        "stroke-linejoin",
        "round",
        "d",
        "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42",
      ],
      [
        "tabindex",
        "1",
        1,
        "dropdown-content",
        "z-50",
        "menu",
        "bg-base-100",
        "rounded-box",
        "w-52",
        "p-2",
        "shadow-sm",
      ],
      [1, "dropdown", "dropdown-end"],
      [1, "flex", "items-center", "gap-3"],
      [
        "routerLink",
        "/members",
        "routerLinkActive",
        "text-accent",
        3,
        "routerLinkActiveOptions",
      ],
      ["routerLink", "/lists", "routerLinkActive", "text-accent"],
      ["routerLink", "/messages", "routerLinkActive", "text-accent"],
      [
        "routerLink",
        "/admin",
        "routerLinkActive",
        "text-accent",
        4,
        "appHasRole",
      ],
      ["routerLink", "/admin", "routerLinkActive", "text-accent"],
      [3, "click"],
      [
        "tabindex",
        "0",
        "role",
        "button",
        1,
        "flex",
        "items-center",
        "text-white",
        "text-xl",
        "gap-3",
        "cursor-pointer",
      ],
      ["alt", "user avatar", 1, "w-10", "h-10", "rounded-full", 3, "src"],
      [
        "tabindex",
        "0",
        1,
        "dropdown-content",
        "menu",
        "bg-base-100",
        "rounded-box",
        "z-1",
        "w-52",
        "p-2",
        "shadow-sm",
        3,
        "click",
      ],
      [3, "routerLink"],
      [1, "flex", "items-center", "gap-3", 3, "ngSubmit"],
      [
        "name",
        "email",
        "type",
        "text",
        "placeholder",
        "Email",
        1,
        "input",
        3,
        "ngModelChange",
        "ngModel",
      ],
      [
        "name",
        "password",
        "type",
        "password",
        "placeholder",
        "Password",
        1,
        "input",
        3,
        "ngModelChange",
        "ngModel",
      ],
      ["type", "submit", 1, "btn", "btn-primary"],
      [1, "mr-2", "loading", "loading-spinner"],
    ],
    template: function (n, r) {
      if (
        (n & 1 &&
          (h(0, "header", 1)(1, "div", 2)(2, "div", 3)(3, "a", 4),
          ke(),
          h(4, "svg", 5),
          U(5, "path", 6),
          m(),
          vt(),
          h(6, "h3", 7),
          y(7, "Programmer's App"),
          m()()(),
          h(8, "nav", 8),
          P(9, rR, 7, 4),
          m(),
          P(10, oR, 1, 0, "span", 9),
          h(11, "div", 10)(12, "div", 11)(13, "button", 12),
          ke(),
          h(14, "svg", 13),
          U(15, "path", 14),
          m(),
          vt(),
          h(16, "span"),
          y(17),
          m()(),
          h(18, "ul", 15),
          ge(19, iR, 3, 1, "li", null, rt),
          m()(),
          P(21, sR, 12, 4, "div", 16)(22, cR, 7, 3, "form", 17),
          m()()()),
        n & 2)
      ) {
        let o;
        v(3),
          Z("routerLinkActiveOptions", Ps(5, SC)),
          v(6),
          F(r.accountService.currentUser() ? 9 : -1),
          v(),
          F(r.busyService.busyRequestCount() > 0 ? 10 : -1),
          v(7),
          oe(r.selectedTheme()),
          v(2),
          ve(r.themes),
          v(2),
          F((o = r.accountService.currentUser()) ? 21 : 22, o);
      }
    },
    dependencies: [Gn, Hr, kt, fn, Br, mr, Fo, un, va, Id],
    encapsulation: 2,
  });
};
var lR = ["dialogRef"],
  Md = class e {
    dialogRef;
    messagee = "Are you sure?";
    resolver = null;
    constructor() {
      f(Zi).register(this);
    }
    open(t) {
      return (
        (this.messagee = t),
        this.dialogRef.nativeElement.showModal(),
        new Promise((n) => (this.resolver = n))
      );
    }
    confirm() {
      this.dialogRef.nativeElement.close(),
        this.resolver?.(!0),
        (this.resolver = null);
    }
    cancel() {
      this.dialogRef.nativeElement.close(),
        this.resolver?.(!1),
        (this.resolver = null);
    }
    static ɵfac = function (n) {
      return new (n || e)();
    };
    static ɵcmp = L({
      type: e,
      selectors: [["app-confirm-dialog"]],
      viewQuery: function (n, r) {
        if ((n & 1 && $t(lR, 5), n & 2)) {
          let o;
          Ct((o = Et())) && (r.dialogRef = o.first);
        }
      },
      decls: 12,
      vars: 1,
      consts: [
        ["dialogRef", ""],
        [1, "modal"],
        [1, "modal-box"],
        [1, "font-bold", "text-lg"],
        [1, "py-2"],
        [1, "modal-action"],
        [1, "btn", "btn-outline", 3, "click"],
        [1, "btn", "btn-primary", 3, "click"],
      ],
      template: function (n, r) {
        if (n & 1) {
          let o = Y();
          A(0, "dialog", 1, 0)(2, "div", 2)(3, "h3", 3),
            y(4),
            R(),
            A(5, "p", 4),
            y(6, "This action cannot be undone"),
            R(),
            A(7, "div", 5)(8, "button", 6),
            ie("click", function () {
              return I(o), S(r.cancel());
            }),
            y(9, "Cancel"),
            R(),
            A(10, "button", 7),
            ie("click", function () {
              return I(o), S(r.confirm());
            }),
            y(11, "Confirm"),
            R()()()();
        }
        n & 2 && (v(4), oe(r.messagee));
      },
      encapsulation: 2,
    });
  };
var Td = class e {
  router = f(Ne);
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = L({
    type: e,
    selectors: [["app-root"]],
    decls: 4,
    vars: 6,
    template: function (n, r) {
      n & 1 &&
        (U(0, "app-nav"),
        h(1, "div"),
        U(2, "router-outlet"),
        m(),
        U(3, "app-confirm-dialog")),
        n & 2 &&
          (v(),
          fe("mt-24", r.router.url !== "/")("container", r.router.url !== "/")(
            "mx-auto",
            r.router.url !== "/"
          ));
    },
    dependencies: [Sd, Oo, Md],
    encapsulation: 2,
  });
};
Jh(Td, wC).catch((e) => console.error(e));
