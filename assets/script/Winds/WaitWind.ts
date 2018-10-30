import { BaseUI, UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { TimeDelay } from "../../YK/core/Util/TimeDelay";
import { LoadingWind } from "./LoadingWind";

export class WaitWind extends BaseUI
{
    public modal: boolean = false
    public dontDel: boolean = true
    protected contentPane: cc.Node = null
    public prefabUrl = "prefab/WaitWind"
    protected clickBbackgroundClose = false
    protected mGrayCover : cc.Node = null
    protected mLoadingRing : cc.Node = null
    
    protected OnInit(param: any)
    {
        super.OnInit(param)
        this.mGrayCover = this.UIObj.get("GrayCover")
        this.mLoadingRing = this.UIObj.get("LoadingRing")
    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
    }

    public OnShown(param: any)
    {
        console.log("显示完成");
        
        super.OnShown(param)
        this.mGrayCover.active = false
        this.mLoadingRing.active = false
        TimeDelay.Instance.Remove(this.ShownLoadingRing,this)        
        TimeDelay.Instance.Remove(this.TimeOut,this)        
        TimeDelay.Instance.Add(1,1,this.ShownLoadingRing,this)
        TimeDelay.Instance.Add(10,1,this.TimeOut,this)
    }

    public ShownLoadingRing()
    {
        this.mGrayCover.active = true
        this.mLoadingRing.active = true
    }

    /**
     * 十秒自动关闭
     */
    public TimeOut()
    {
        this.Hide()
    }

    public OnHide()
    {
        super.OnHide()
        TimeDelay.Instance.Remove(this.TimeOut,this)        
        TimeDelay.Instance.Remove(this.ShownLoadingRing,this)        
    }

    public onDestroy()
    {
        TimeDelay.Instance.Remove(this.TimeOut,this)        
        TimeDelay.Instance.Remove(this.ShownLoadingRing,this)
        super.onDestroy()
    }
}