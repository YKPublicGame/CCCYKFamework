import { DispatchEventNode } from "../YK/core/EventMgr/DispatchEventNode";
import { ModeMgr } from "../YK/core/ModeMgr/ModeMgr";
import { SceneMgr } from "../YK/core/SceneMgr/SceneMgr";
import LoadingScene from "./Scene/LoadingScene";
import { WaitWind } from "./Winds/WaitWind";
import { UIConfig } from "../YK/core/UIMgr/UIMgr";
import { RoleMode } from "./Modes/RoleMode"
import { PrivRoomMode } from "./Modes/PrivRoomMode";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends DispatchEventNode
{

    private static mInstance: GameMain = null

    public static get Instance()
    {
        return this.mInstance
    }

    public onLoad()
    {
        GameMain.mInstance = this
        this.InitGame();
    }

    public InitGame()
    {
        UIConfig.globalModalWaiting = WaitWind
        console.log("start add RoleMode")
        ModeMgr.Instance.AddMode<RoleMode>(RoleMode)
        console.log("start add PrivRoomMode")
        ModeMgr.Instance.AddMode<PrivRoomMode>(PrivRoomMode)
        ModeMgr.Instance.InitData()
        SceneMgr.Instance.GoToScene(LoadingScene)
    }


}
