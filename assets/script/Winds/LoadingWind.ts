import { BaseUI } from "../../YK/core/UIMgr/UIMgr";
import { TaskMgr } from "../../YK/core/Task/TaskBase";
import { EventDef, LoadingProgressEvenet } from "../Defs/EventDef";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class LoadingWind extends BaseUI
{
    public modal: boolean = false
    public dontDel: boolean = true
    public prefabUrl = "prefab/Loading/Loading"
    protected clickBbackgroundClose = false
    
    /**
   * 当前进度
   */
    private mProgress: Number = 0

    /**
     * 当前任务信息
     */
    private mShowInfoString: string = "正在加载..."

    private mLabelProgress: cc.Label

    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.mLabelProgress = this.UIObj.get("LabelProgress").getComponent(cc.Label)
    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
    }

    public OnShown(param: any)
    {
        super.OnShown(param)
        this.eventMgr.addUIEvent(LoadingProgressEvenet.EventID)

        this.mProgress = 0
        this.mShowInfoString = "正在加载..."
    }

    protected OnHandler(ev: EventData)
    {
        switch (ev.cmd)
        {
            case LoadingProgressEvenet.EventID:
                this.RefreshInfo(ev as LoadingProgressEvenet)
                break;
        }
    }

    public OnHide()
    {
        super.OnHide()
    }

    public RefreshInfo(ev:LoadingProgressEvenet)
    {
        this.mProgress = ev.data.progress
        this.mLabelProgress.string = this.mProgress.toFixed() + "%"
    }

}