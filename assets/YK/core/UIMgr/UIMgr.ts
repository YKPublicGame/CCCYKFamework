import { DispatchEventNode, EventData } from "../EventMgr/DispatchEventNode";
import { EventListenerMgr, InterchangeableEventListenerMgr } from "../EventMgr/EventListenerMgr";
import { ResMgr } from "../ResMgr/ResMgr";
import { NetMgr } from "../Net/NetMgr";
import { SceneMgr } from "../SceneMgr/SceneMgr";
import { ModeMgr } from "../ModeMgr/ModeMgr";
const { ccclass, property } = cc._decorator;

export class UIConfig
{
    public static modalLayerColor = new cc.Color(0, 0, 0, 0.4 * 255)  //默认显示背景颜色
    public static globalModalWaiting: any = null    //等待界面
    public static autoCloseWaitingTime: number = 10 //自动关闭等待界面的时间
}

@ccclass
export class UIMgr extends DispatchEventNode
{
    private mWinds: Map<any, BaseUI> = new Map<any, BaseUI>()
    private modalWaitPane: BaseUI = null
    private static mInstance: UIMgr = null
    public static get Instance(): UIMgr
    {
        if (this.mInstance == null)
        {
            this.mInstance = cc.Canvas.instance.addComponent(UIMgr)
        }
        return this.mInstance
    }

    /**
     * 显示界面
     * @param type 界面类型
     * @param param 界面数据
     */
    public ShowWind(type: any, param = null)
    {
        let wind: BaseUI = this.mWinds.get(type)
        if (wind == null)
        {
            let node: cc.Node = new cc.Node()
            this.node.position = cc.Vec2.ZERO
            node.setContentSize(this.node.getContentSize())
            wind = node.addComponent(type)
            let name = wind.prefabUrl.substring(wind.prefabUrl.lastIndexOf("/") + 1)
            node.name = name
            node.addComponent(cc.Button)
            wind.Init(param)
            this.mWinds.set(type, wind)
        }

        if (!wind.IsShowing)
            this.node.addChild(wind.node)
        else
        {
            if (!wind.IsTop)
                this.BringToFront(wind)
        }
        wind.Shown(param)
        this.AdjustModalLayer()
    }

    public HideWind(type: any)
    {
        let wind: BaseUI = this.mWinds.get(type)
        if (wind != null)
        {
            wind.Hide()
        }
    }


    public HideWindowImmediatelyByType(type: any, dispose: boolean)
    {
        let wind: BaseUI = this.mWinds.get(type)
        if (wind != null)
        {
            this.HideWindowImmediately(wind, dispose)
        }

    }

    public HideWindowImmediately(wind: BaseUI, dispose: boolean)
    {
        if (wind != null)
        {
            if (wind.node.parent == this.node)
            {
                this.node.removeChild(wind.node)
            }
            if (dispose && !wind.dontDel)
            {
                wind.node.destroy()
                let _key = null
                this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => 
                {
                    if (value == wind)
                    {
                        _key = key
                    }
                }));
                if (_key != null)
                    this.mWinds.delete(_key)
            }
        }
        this.AdjustModalLayer()
    }


    public GetAllWind(isShow = false, containDotDel = true): Array<any>
    {
        let keys: Array<any> = new Array<any>()

        this.mWinds.forEach(((value: BaseUI, key: any, map: Map<BaseUI, any>) => 
        {
            if (!value.dontDel || containDotDel)
            {
                if (isShow)
                {
                    if (value.IsShowing)
                    {
                        keys.push(key)
                    }
                }
                else
                {
                    keys.push(key)
                }
            }
        }));

        return keys
    }


    public HideAllWind(dispose = false, containDotDel = false)
    {
        let winds = this.GetAllWind(false, containDotDel)
        winds.forEach(element =>
        {
            this.HideWindowImmediatelyByType(element, dispose)
        });
    }

    /**
     * 显示窗口到最前面
     * @param wind 需要显示的窗口
     */
    public BringToFront(wind: BaseUI)
    {
        let cnt = this.node.childrenCount;
        let i = cnt - 1;
        // if (this.mModeLayer.parent != null && !wind.modal)
        // {
        //     i = this.mModeLayer.getSiblingIndex() + 1
        // }
        for (; i >= 0; i--)
        {
            let g = this.node.children[i].getComponent(BaseUI)
            if (g != null)
            {
                if (g == wind)
                { return; }
                else break
            }
        }
        if (wind != null)
        {
            if (!wind.IsTop)
            {
                if (i >= 0)
                    wind.node.setSiblingIndex(i)
            }
        }
    }

    public ShowModalWait(param = null)
    {
        if (UIConfig.globalModalWaiting != null)
        {
            this.ShowWind(UIConfig.globalModalWaiting, param)
        }
    }

    public CloseModalWait(): void
    {
        if (UIConfig.globalModalWaiting != null)
        {
            this.HideWind(UIConfig.globalModalWaiting)
        }
    }


    private mModeLayer: cc.Node

    /**
     * 创建一个黑背景
     */
    private createModalLayer(): void
    {
        this.mModeLayer = new cc.Node("ModalLayer")
        let sp = this.mModeLayer.addComponent(cc.Sprite)

        let xx: cc.SpriteFrame = new cc.SpriteFrame("res/raw-internal/image/default_sprite_splash.png")
        sp.spriteFrame = xx
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM
        this.node.addChild(this.mModeLayer)
        let ww = this.mModeLayer.addComponent(cc.Widget)
        ww.isAlignBottom = true
        ww.isAlignTop = true
        ww.isAlignLeft = true
        ww.isAlignRight = true
        ww.bottom = 0
        ww.top = 0
        ww.left = 0
        ww.right = 0
        this.mModeLayer.color = cc.color(UIConfig.modalLayerColor.getR(), UIConfig.modalLayerColor.getG(), UIConfig.modalLayerColor.getB())
        this.mModeLayer.opacity = UIConfig.modalLayerColor.getA()
    }


    private AdjustModalLayer()
    {
        if (this.mModeLayer == null) this.createModalLayer()

        let cnt = this.node.childrenCount - 1;

        for (var index = cnt; index >= 0; index--)
        {
            var element = this.node.children[index].getComponent(BaseUI)
            if (element != null && element.modal)
            {
                this.mModeLayer.active = false
                if (this.mModeLayer.parent == null)
                {
                    this.node.insertChild(this.mModeLayer, index)
                }
                else
                {
                    if (index > 0)
                    {
                        if (element.IsTop)
                            this.mModeLayer.setSiblingIndex(index - 1)
                        else
                            this.mModeLayer.setSiblingIndex(index)
                    }
                    else
                        this.mModeLayer.setSiblingIndex(0)
                }
                this.mModeLayer.active = true
                return
            }
        }
        this.node.removeChild(this.mModeLayer)
    }

}

export class BaseUI extends cc.Component
{
    public eventMgr: InterchangeableEventListenerMgr = null;
    public uiName = ""

    /**
     * 是否在顶层
     */
    public get IsTop(): boolean
    {
        return this.node.parent != null && this.node.getSiblingIndex() == this.node.parent.childrenCount - 1
    }

    public get IsShowing(): boolean
    {
        return this.node.parent != null
    }

    protected btnCloseNodeName: string = "BtnClose"

    public modal: boolean = false
    public dontDel: boolean = false
    private mParam: any = null
    public UIObj: Map<string, cc.Node> = new Map<string, cc.Node>()
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false
    protected contentPane: cc.Node = null
    public prefabUrl = ""

    protected clickBbackgroundClose = false

    public Init(param)
    {
        this.eventMgr = new InterchangeableEventListenerMgr(this, this.OnHandler)

        this.mParam = param
        let prefab = ResMgr.Instance.GetRes(this.prefabUrl)
        if (prefab != null)
        {
            this.contentPane = cc.instantiate(prefab)
            this.contentPane.active = false
            this.contentPane.parent = this.node
            this.contentPane.active = true
            this.contentPane.x = 0
            this.contentPane.y = 0
            this.contentPane.setContentSize(this.node.getContentSize())
        }
        else
        {
            console.error("实例化对象失败：url=" + this.prefabUrl)
            return
        }
        this.UIObj.clear()

        let nodes = this.FindAllChildren(this.contentPane)
        nodes.forEach(element =>
        {
            if (element.name.startsWith(this.btnNameStartsWith))
            {
                //let btn = element.getComponent(cc.Button)

                if (element.name == "BtnClose")
                {
                    element.on("click", this.OnBtnClose, this)
                }
                else
                {
                    element.on("click", this.OnBtnClick, this)
                }
            }
            this.UIObj.set(element.name, element)
        });

        if (this.clickBbackgroundClose && this.modal)
        {
            this.node.on("click", this.OnBtnClose, this)
        }
        this.OnInit(param)
    }

    public FindAllChildren(root: cc.Node): Array<cc.Node>
    {
        let list: Array<cc.Node> = new Array<cc.Node>()
        list.push(root)
        if (root.childrenCount <= 0)
        {
            return list
        }
        root.children.forEach(element =>
        {
            let xx = this.FindAllChildren(element)
            xx.forEach(e =>
            {
                list.push(e)
            });
        });
        return list
    }

    public Shown(param)
    {
        this.mParam = param
        if (this.isNeedShowAnimation)
            this.DoShowAnimation()
        else
            this.OnShown(param)
    }

    public Hide()
    {
        if (this.isNeedHideAnimation)
            this.DoHideAnimation()
        else
            this.OnHide()
    }

    public OnShown(Param): void
    {

    }

    public OnHide()
    {
        this.mParam = null
        UIMgr.Instance.HideWindowImmediately(this, false)
        this.eventMgr.RemoveAll()
    }

    protected OnHandler(ev: EventData)
    {
    }

    protected DoShowAnimation()
    {
        this.OnShown(this.mParam)
    }

    protected DoHideAnimation()
    {
        this.OnHide()
    }

    protected OnInit(param: any)
    {

    }

    protected OnBtnClick(ev: cc.Event.EventCustom)
    {

    }

    protected OnBtnClose()
    {
        this.Hide()
    }
}
