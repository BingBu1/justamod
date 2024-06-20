"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.MapMarkMgr = void 0);
const Log_1 = require("../../../../../../Core/Common/Log"),
  Protocol_1 = require("../../../../../../Core/Define/Net/Protocol"),
  EntitySystem_1 = require("../../../../../../Core/Entity/EntitySystem"),
  ObjectUtils_1 = require("../../../../../../Core/Utils/ObjectUtils"),
  EventDefine_1 = require("../../../../../Common/Event/EventDefine"),
  EventSystem_1 = require("../../../../../Common/Event/EventSystem"),
  ConfigManager_1 = require("../../../../../Manager/ConfigManager"),
  ModelManager_1 = require("../../../../../Manager/ModelManager"),
  GeneralLogicTreeUtil_1 = require("../../../../GeneralLogicTree/GeneralLogicTreeUtil"),
  TrackController_1 = require("../../../../Track/TrackController"),
  WorldMapDefine_1 = require("../../../../WorldMap/WorldMapDefine"),
  MapController_1 = require("../../../Controller/MapController"),
  MapDefine_1 = require("../../../MapDefine"),
  MapUtil_1 = require("../../../MapUtil"),
  CustomMarkItem_1 = require("../../../Marks/MarkItem/CustomMarkItem"),
  PlayerMarkItem_1 = require("../../../Marks/MarkItem/PlayerMarkItem"),
  TeleportMarkItem_1 = require("../../../Marks/MarkItem/TeleportMarkItem"),
  MarkItemUtil_1 = require("../../../Marks/MarkItemUtil");
class MapMarkMgr {
  constructor(t, e, i, r) {
    (this.ELi = void 0),
      (this.SLi = new WorldMapDefine_1.MarkPriority2HierarchyIndexHelper()),
      (this.yLi = new WorldMapDefine_1.MarkPriority2HierarchyIndexHelper()),
      (this.MapType = 2),
      (this.ILi = new Map()),
      (this.TLi = new Map()),
      (this.LLi = new Set()),
      (this.DLi = new Set()),
      (this.RLi = new Map()),
      (this.ULi = 1),
      (this.ALi = 0),
      (this.xLi = (t) => {
        this.PLi(t);
      }),
      (this.wLi = (t) => {
        this.BLi(t);
      }),
      (this.CreateDynamicMark = (t) => {
        if (t.MapId === this.ALi) {
          t = MarkItemUtil_1.MarkItemUtil.Create(
            t,
            this.MapType,
            this.ULi,
            this.ELi
          );
          if (t) return this.AddMarkItem(t.MarkType, t), t;
        }
      }),
      (this.bLi = (t, e, i) => {
        e = this.GetMarkItem(t, e);
        e &&
          e instanceof CustomMarkItem_1.CustomMarkItem &&
          (e.SetConfigId(i), e.IsTracked) &&
          (this.qLi(t, e.MarkId, !1), this.qLi(t, e.MarkId, !0));
      }),
      (this.GLi = (t, e) => {
        var i = this.GetMarkItem(t, e);
        i &&
          (this.qLi(t, i.MarkId, !1),
          this.RLi.has(e) && this.RLi.delete(e),
          this.RemoveMarkItem(t, e)?.Destroy());
      }),
      (this.qLi = (t, e, i, r = !1) => {
        var s,
          t = this.GetMarkItem(t, e);
        t &&
          ((s = ModelManager_1.ModelManager.TrackModel.IsTracking(
            t.TrackSource,
            e
          )),
          (!r && s === i) ||
            (i
              ? (TrackController_1.TrackController.StartTrack({
                  TrackSource: t.TrackSource,
                  Id: e,
                  IconPath: t.IconPath,
                  TrackTarget: t.TrackTarget,
                }),
                this.LLi.add(t))
              : (TrackController_1.TrackController.EndTrack(t.TrackSource, e),
                this.DLi.add(t),
                this.LLi.delete(t))));
      }),
      (this.tmt = (t) => {
        t = this.GetMarkItem(0, t.Id);
        t &&
          !t.IsTracked &&
          t.LogicUpdate(
            GeneralLogicTreeUtil_1.GeneralLogicTreeUtil.GetPlayerLocation()
          ),
          ((t && t.View) ?? t?.IsTracked) && this.LLi.add(t);
      }),
      (this.imt = (t) => {
        t = this.GetMarkItem(0, t.Id);
        t && t.View && (this.LLi.delete(t), this.DLi.add(t));
      }),
      (this.NLi = (t) => {
        var e = this.GetMarkItemsByType(11);
        e && 0 < e.size && this.OLi(11), this.kLi(t);
      }),
      (this.xTi = (t) => {
        let e = this.GetMarkItem(5, t);
        (e = e || this.GetMarkItem(6, t)) &&
          e instanceof TeleportMarkItem_1.TeleportMarkItem &&
          e.IsTracked &&
          MapController_1.MapController.RequestTrackMapMark(
            e.MarkType,
            e.MarkId,
            !1
          );
      }),
      (this.gpe = (t, e, i) => {
        var r = e.Entity.GetComponent(0),
          s = r.GetPbEntityInitData(),
          n = r.GetEntityConfigType();
        n === Protocol_1.Aki.Protocol.EntityConfigType.OldEntity ||
          n === Protocol_1.Aki.Protocol.EntityConfigType.Character ||
          MapUtil_1.MapUtil.IsTemporaryTeleportEntity(s) ||
          ((n = r.GetBaseInfo())?.MapIcon && this.FLi(n.MapIcon, e.Id, i));
      }),
      (this.fpe = (t, e) => {
        this.RLi.has(e.Id) && this.RLi.delete(e.Id),
          this.RemoveMarkItem(7, e.Id)?.Destroy();
      }),
      (this.MapType = t),
      (this.ULi = r),
      (this.ELi = e),
      (this.ALi =
        2 === t
          ? MapDefine_1.BIG_WORLD_MAP_ID
          : ModelManager_1.ModelManager.GameModeModel.InstanceDungeon
              .MapConfigId);
  }
  Initialize() {
    this.bme();
  }
  Dispose() {
    this.qme(), this.OLi();
  }
  OnMapSetup() {
    this.OLi(),
      this.VLi(),
      this.HLi(),
      this.kLi(ModelManager_1.ModelManager.CreatureModel.GetAllScenePlayers());
    for (var [, t] of this.ILi)
      for (var [, e] of t)
        e.IsTracked &&
          12 !== e.MarkType &&
          ModelManager_1.ModelManager.MapModel.SetCurTrackMark([
            e.MarkType,
            e.MarkId,
          ]);
  }
  jLi(t) {
    var e = Math.floor(Math.round(0.01 * t.X) / MapDefine_1.MARK_SCOPE),
      t = Math.floor(Math.round(0.01 * t.Y) / MapDefine_1.MARK_SCOPE);
    return e * MapDefine_1.MARK_HASH_XY_PANDING + t;
  }
  bme() {
    EventSystem_1.EventSystem.Add(
      EventDefine_1.EEventName.MapReplaceMarkResponse,
      this.bLi
    ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.CreateMapMark,
        this.CreateDynamicMark
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.RemoveMapMark,
        this.GLi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.TrackMapMark,
        this.qLi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.TrackMark,
        this.tmt
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.UnTrackMark,
        this.imt
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.ScenePlayerChanged,
        this.NLi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.UnlockTeleport,
        this.xTi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.AddEntity,
        this.gpe
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.RemoveEntity,
        this.fpe
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.OnMarkItemViewCreate,
        this.xLi
      ),
      EventSystem_1.EventSystem.Add(
        EventDefine_1.EEventName.OnMarkItemViewDestroy,
        this.wLi
      );
  }
  qme() {
    EventSystem_1.EventSystem.Remove(
      EventDefine_1.EEventName.MapReplaceMarkResponse,
      this.bLi
    ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.CreateMapMark,
        this.CreateDynamicMark
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.RemoveMapMark,
        this.GLi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.TrackMapMark,
        this.qLi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.TrackMark,
        this.tmt
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.ScenePlayerChanged,
        this.NLi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.UnlockTeleport,
        this.xTi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.AddEntity,
        this.gpe
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.RemoveEntity,
        this.fpe
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.UnTrackMark,
        this.imt
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.OnMarkItemViewCreate,
        this.xLi
      ),
      EventSystem_1.EventSystem.Remove(
        EventDefine_1.EEventName.OnMarkItemViewDestroy,
        this.wLi
      );
  }
  OLi(t) {
    if (t) {
      t = this.ILi.get(t);
      if (t) {
        for (var [, e] of t)
          this.RLi.delete(e.MarkId),
            this.RemoveMarkItem(e.MarkType, e.MarkId),
            e.Destroy();
        t.clear();
      }
    } else {
      for (var [, i] of this.ILi)
        for (var [, r] of i) this.RLi.delete(r.MarkId), r.Destroy();
      this.ILi.clear(),
        this.LLi.clear(),
        this.TLi.clear(),
        this.SLi.ClearData(),
        this.yLi.ClearData();
    }
  }
  WLi(t) {
    var e,
      i = t.WorldPosition;
    i &&
      ((i = this.jLi(i)),
      (e = this.TLi.get(i))
        ? e.add(t)
        : ((e = new Set().add(t)), this.TLi.set(i, e)),
      (t.GridId = i));
  }
  KLi(t) {
    var e = t.GridId,
      e = this.TLi.get(e);
    e && e.delete(t);
  }
  AddMarkItem(e, i) {
    if (i) {
      let t = this.GetMarkItemsByType(e);
      t || ((t = new Map()), this.ILi.set(e, t)),
        t.set(i.MarkId, i),
        this.WLi(i);
    }
  }
  RemoveMarkItem(t, e) {
    t = this.GetMarkItemsByType(t);
    if (t && 0 !== t.size) {
      var i = t.get(e);
      if ((t.delete(e), this.RLi.delete(e), i))
        return (
          this.KLi(i),
          Log_1.Log.CheckInfo() &&
            Log_1.Log.Info("Map", 50, "移除标记_MarkMgr", ["MarkId", e]),
          i
        );
    }
  }
  QLi(t, e, i) {
    var r = t.Holder;
    r &&
      this.MapType === r.MapType &&
      void 0 !== e &&
      t.GetRootItem() &&
      (t.GetRootItem().SetUIParent(e),
      t.SetScale(this.ULi),
      (e = i.AddMarkItem(r.MarkType, r.ShowPriority)),
      t.GetRootItem().SetHierarchyIndex(e));
  }
  $Li(t, e, i) {
    var r = t.Holder;
    r &&
      this.MapType === r.MapType &&
      t.GetRootItem() &&
      e === t.GetRootItem().GetParentAsUIItem() &&
      (i.RemoveMarkItem(t.Holder.MarkType, t.Holder.ShowPriority),
      t.SetScale(this.ULi));
  }
  PLi(t) {
    this.QLi(t, this.ELi, this.SLi);
  }
  BLi(t) {
    this.$Li(t, this.ELi, this.SLi);
  }
  GetMarkItemsByType(t) {
    return this.ILi.get(t);
  }
  GetMarkItem(t, e) {
    if (0 === t) {
      let t = void 0;
      for (const [, i] of this.GetAllMarkItems()) if ((t = i.get(e))) break;
      return t;
    }
    const i = this.GetMarkItemsByType(t);
    if (i) return i.get(e);
  }
  GetAllMarkItems() {
    return this.ILi;
  }
  GetAllMarkItemsByMapId(t) {
    var e,
      i,
      r = new Map();
    for ([e, i] of this.ILi)
      for (var [s, n] of i)
        if (n.MapId === t) {
          let t = r.get(e);
          t || ((t = new Map()), r.set(e, t)), t.set(s, n);
        }
    return r;
  }
  GetMarkItemsByClickPosition(t) {
    var t = MapUtil_1.MapUtil.UiPosition2WorldPosition(t),
      t = this.jLi(t),
      e = [];
    for (const r of this.XLi(t)) {
      var i = this.TLi.get(r);
      i && e.push(...i);
    }
    return e;
  }
  XLi(t) {
    return new Set([
      t,
      t + MapDefine_1.MARK_HASH_XY_PANDING,
      t - MapDefine_1.MARK_HASH_XY_PANDING,
      t + 1,
      t - 1,
      t + MapDefine_1.MARK_HASH_XY_PANDING - 1,
      t + MapDefine_1.MARK_HASH_XY_PANDING + 1,
      t - MapDefine_1.MARK_HASH_XY_PANDING - 1,
      t + 1,
    ]);
  }
  UpdateNearbyMarkItem(t, e, i) {
    var r,
      t = this.jLi(t),
      s = this.XLi(t);
    for (const _ of s) {
      const n = this.TLi.get(_);
      if (n)
        for (const M of n)
          this.RLi.has(M.MarkId) ||
            M instanceof PlayerMarkItem_1.PlayerMarkItem ||
            this.RLi.set(M.MarkId, M);
    }
    const n = this.GetMarkItemsByType(11);
    if (n) for (var [, a] of n) this.RLi.set(a.MarkId, a);
    for ([, r] of this.RLi)
      e(r), r.IsCanShowView || (this.DLi.add(r), this.RLi.delete(r.MarkId));
    for (const f of this.LLi) e(f);
    if (0 !== this.DLi.size) {
      for (const v of this.DLi) {
        var h = v.GridId;
        s.has(h) ||
          (v.LogicUpdate(
            GeneralLogicTreeUtil_1.GeneralLogicTreeUtil.GetPlayerLocation()
          ),
          i(v));
      }
      this.DLi.clear();
    }
    for (const l of s) {
      var o = this.TLi.get(l);
      if (o) for (const m of o) e(m);
    }
  }
  VLi() {
    let t = ConfigManager_1.ConfigManager.MapConfig.GetConfigMarks(this.ALi);
    0 === t.length &&
      this.ALi !== MapDefine_1.BIG_WORLD_MAP_ID &&
      2 === this.MapType &&
      ((this.ALi = MapDefine_1.BIG_WORLD_MAP_ID),
      (t = ConfigManager_1.ConfigManager.MapConfig.GetConfigMarks(this.ALi)));
    for (const n of t) {
      var e;
      1 !== n.MarkId &&
        ((e = MarkItemUtil_1.MarkItemUtil.CreateConfigMark(
          n.MarkId,
          n,
          this.MapType,
          this.ULi,
          this.ELi
        )),
        this.AddMarkItem(n.ObjectType, e));
    }
    var i, r;
    for ([
      i,
      r,
    ] of ModelManager_1.ModelManager.MapModel.GetEntityPendingList()) {
      var s = EntitySystem_1.EntitySystem.Get(i);
      s
        ? ((s = s.GetComponent(1)?.Owner), this.FLi(r, i, s))
        : Log_1.Log.CheckDebug() &&
          Log_1.Log.Debug("Map", 50, "找不到实体对象", [
            "实体ID",
            i.toString(),
          ]);
    }
  }
  HLi() {
    for (const t of ModelManager_1.ModelManager.MapModel.GetAllDynamicMarks().values())
      for (const e of t.values())
        e.MapId === this.ALi && this.CreateDynamicMark(e);
  }
  kLi(t) {
    if (ModelManager_1.ModelManager.OnlineModel.GetIsTeamModel())
      for (const i of t) {
        var e;
        i.GetPlayerId() !==
          ModelManager_1.ModelManager.PlayerInfoModel.GetId() &&
          ((e =
            ModelManager_1.ModelManager.OnlineModel?.GetCurrentTeamListById(
              i.GetPlayerId()
            )?.PlayerNumber ?? 1),
          (e = new MapDefine_1.PlayerMarkCreateInfo(
            i.GetPlayerId(),
            e,
            i.GetLocation().ToUeVector()
          )),
          (e = MarkItemUtil_1.MarkItemUtil.Create(
            e,
            this.MapType,
            this.ULi,
            this.ELi
          )),
          this.ALi === MapDefine_1.BIG_WORLD_MAP_ID && (e.IsInAoiRange = !0),
          this.AddMarkItem(11, e));
      }
  }
  FLi(t, e, i) {
    ObjectUtils_1.ObjectUtils.IsValid(i) &&
      ((e = MarkItemUtil_1.MarkItemUtil.CreateEntityMark(
        e,
        t,
        this.ELi,
        i,
        this.MapType,
        this.ULi
      )),
      this.AddMarkItem(7, e));
  }
}
exports.MapMarkMgr = MapMarkMgr;
//# sourceMappingURL=MapMarkMgr.js.map
