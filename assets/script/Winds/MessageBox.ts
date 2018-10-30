import { Func } from "../../YK/core/EventMgr/DispatchEventNode";
import { UIMgr, BaseUI } from "../../YK/core/UIMgr/UIMgr";

export class MessageBox extends BaseUI
{
    public modal: boolean = true
    public dontDel: boolean = true
    protected contentPane: cc.Node = null
    public prefabUrl = "prefab/MessageBox/MessageBoxCommon"
    protected clickBbackgroundClose = false
    protected mGrayCover: cc.Node = null
    protected mLoadingRing: cc.Node = null

    private BtnClose: cc.Button
    private LabelTips: cc.Label

    private BtnOK: cc.Button
    private LabelOK: cc.Label

    private BtnCancel: cc.Button
    private LabelCancel: cc.Label

    private BtnConfirm: cc.Button
    private LabelConfirm: cc.Label

    private static mMessageBoxDataPools: Array<MessageBoxData> = new Array<MessageBoxData>()

    public static Create(content: string): MessageBoxData
    {
        if (this.mMessageBoxDataPools.length > 0)
        {
            let da = this.mMessageBoxDataPools.pop()
            da.SetContent(content)
            return da
        }
        return new MessageBoxData(content)
    }

    protected OnInit(param: any)
    {
        super.OnInit(param)
        let findNode: cc.Node = null
        findNode = this.UIObj.get("BtnClose")
        this.BtnClose = findNode.getComponent(cc.Button)

        findNode = this.UIObj.get("LabelTips")
        this.LabelTips = findNode.getComponent(cc.Label)

        findNode = this.UIObj.get("BtnOK")
        this.BtnOK = findNode.getComponent(cc.Button)

        findNode = this.UIObj.get("LabelOK")
        this.LabelOK = findNode.getComponent(cc.Label)


        findNode = this.UIObj.get("BtnCancel")
        this.BtnCancel = findNode.getComponent(cc.Button)

        findNode = this.UIObj.get("LabelCancel")
        this.LabelCancel = findNode.getComponent(cc.Label)

        findNode = this.UIObj.get("BtnConfirm")
        this.BtnConfirm = findNode.getComponent(cc.Button)

        findNode = this.UIObj.get("LabelConfirm")
        this.LabelConfirm = findNode.getComponent(cc.Label)

    }


    private mData: MessageBoxData = null

    public OnShown(param: any)
    {
        super.OnShown(param)
        this.mData = param
        this.LabelTips.string = this.mData.content

        if (this.mData.type == MessageBoxType.None)
        {
            this.BtnOK.node.active = false
            this.BtnCancel.node.active = false
            this.BtnConfirm.node.active = false
            this.BtnClose.node.active = true
        }
        else if (this.mData.type == MessageBoxType.ShowConfirm)
        {
            this.BtnOK.node.active = false
            this.BtnCancel.node.active = false
            this.BtnConfirm.node.active = true
            this.BtnClose.node.active = false
            
            this.LabelConfirm.string = this.mData.labBtnConfirmStr
        }
        else
        {
            this.BtnOK.node.active = true
            this.BtnCancel.node.active = true
            this.BtnClose.node.active = true            
            this.BtnConfirm.node.active = false
            this.LabelOK.string = this.mData.labBtnOkStr
            this.LabelCancel.string = this.mData.labBtnCancelStr
        }
    }

    public OnHide()
    {
        if (this.mData != null)
        {
            this.mData.reset()
            MessageBox.mMessageBoxDataPools.push(this.mData)
            this.mData = null
        }
        super.OnHide()
    }

    public onDestroy()
    {
        super.onDestroy()
        MessageBox.mMessageBoxDataPools.splice(0, MessageBox.mMessageBoxDataPools.length)
    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {
        super.OnBtnClick(ev)
        
        if (ev.target == this.BtnOK.node)
        {
            if (this.mData.BtnOkCallBack != null)
                this.mData.BtnOkCallBack.Invoke()
            this.OnBtnClose()
        }
        else if (ev.target == this.BtnCancel.node)
        {
            if (this.mData.BtnCancelCallBack != null)
                this.mData.BtnCancelCallBack.Invoke()
            this.OnBtnClose()
        }
        else if (ev.target == this.BtnConfirm.node)
        {
            if (this.mData.BtnBtnConfirmCallBack != null)
                this.mData.BtnBtnConfirmCallBack.Invoke()
            this.OnBtnClose()
        }
    }
}

enum MessageBoxType
{
    None,
    ShowConfirm,
    ShowOkAndCancel,
}
class MessageBoxData
{
    public constructor(content)
    {
        this.content = content
    }

    public get type(): MessageBoxType
    {
        let t = MessageBoxType.None;
        if (this.BtnBtnConfirmCallBack != null)
        {
            t = MessageBoxType.ShowConfirm
        }
        else if (this.BtnOkCallBack != null || this.BtnCancelCallBack != null)
        {
            t = MessageBoxType.ShowOkAndCancel
        }
        return t
    }

    public content: string = null

    public BtnOkCallBack: Func = null
    public labBtnOkStr: string = null

    public BtnCancelCallBack: Func = null
    public labBtnCancelStr: string = null

    public BtnBtnConfirmCallBack: Func = null
    public labBtnConfirmStr: string = null

    public SetBtnOkAndCancelCallBack(okCallBack: Func, okStr: string = "好的",
        cancelCallBack: Func = null, cancelStr: string = "好的")
    {
        this.BtnOkCallBack = okCallBack
        this.labBtnOkStr = okStr
        this.BtnCancelCallBack = cancelCallBack
        this.labBtnCancelStr = cancelStr
        return this
    }

    public SetBtnConfirmCallBack(callBack: Func, labStr: string = "确定")
    {
        this.BtnBtnConfirmCallBack = callBack
        this.labBtnConfirmStr = labStr

        this.BtnOkCallBack = null
        this.labBtnOkStr = null
        this.BtnCancelCallBack = null
        this.labBtnCancelStr = null
        return this
    }

    public SetContent(content: string)
    {
        this.content = content
    }

    public reset()
    {
        this.BtnOkCallBack = null
        this.labBtnOkStr = null
        this.BtnCancelCallBack = null
        this.labBtnCancelStr = null
        this.BtnBtnConfirmCallBack = null
        this.labBtnConfirmStr = null
        this.content = null
    }

    public Show()
    {
        UIMgr.Instance.ShowWind(MessageBox, this)
    }
}