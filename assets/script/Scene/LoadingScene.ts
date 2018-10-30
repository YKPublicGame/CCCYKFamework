import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { EventData, Func } from "../../YK/core/EventMgr/DispatchEventNode";
import { UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { TaskMgr } from "../../YK/core/Task/TaskBase";
import { LoadingWind } from "../Winds/LoadingWind";
import { LoadGruopInfo } from "../../YK/core/ResMgr/ResMgr";
import { LoadingProgressEvenet } from "../Defs/EventDef";
import { MessageBox } from "../Winds/MessageBox";
import { SceneMgr } from "../../YK/core/SceneMgr/SceneMgr";
import MainScene from "./MainScene";
import { NetMgr } from "../../YK/core/Net/NetMgr";
import { ProtocolDef } from "../Defs/ProtocolDef";
import { ProtoMap } from "../../YK/core/Net/ProtoMap";
import { LoginScene } from "./LoginScene";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends SceneBase
{
    private initNeedLoadTask: LoadGruopInfo
    protected OnInit(param: any)
    {
        super.OnInit(param)

        this.needLoadRes
            .add("prefab/Loading/Loading", true)
        this.initNeedLoadTask = new LoadGruopInfo()

        this.initNeedLoadTask
            .add("prefab/MessageBox/MessageBoxCommon", true)
            .add("prefab/WaitWind", true)
            .onItemCompletion(this.loadItemCompletion, this)
            .onCompletion(this.loadGameResFinish, this)
    }


    private loadItemCompletion()
    {
        let ev = new LoadingProgressEvenet();
        ev.Progress = this.initNeedLoadTask.Progress
        UIMgr.Instance.DispatchEvent(ev)
    }

    /**
     * 资源加载完成
     */
    private loadGameResFinish()
    {
        NetMgr.Instance.init(() =>
        {
            this.AddProto()
            ProtocolDef.Protocols.forEach(element =>
            {
                ProtoMap.AddProto(element)
            });

        })
    }

    private AddProto()
    {
        NetMgr.Instance.AddProto("NetPack.proto", ProtocolDef.ProtocolNames)
        this.StartGame()
    }


    public StartGame()
    {
        let ev = new LoadingProgressEvenet();
        ev.Progress = 100
        UIMgr.Instance.DispatchEvent(ev)
        SceneMgr.Instance.GoToScene(LoginScene)
    }

    protected OnEnter(param: any)
    {
        super.OnEnter(param)
        UIMgr.Instance.ShowWind(LoadingWind)
        this.initNeedLoadTask.start()
    }

    protected OnHandler(ev: EventData)
    {
        super.OnHandler(ev)
    }

    protected OnLeave()
    {
        super.OnLeave()
    }

    protected OnDestroy()
    {
        super.OnDestroy()
    }

    protected OnLoaded()
    {
        super.OnLoaded()
    }

    protected OnTaskFinished()
    {
        super.OnTaskFinished()
    }
}
