import { ResponseMessageEvent } from "./ResponseMessageEvent";
import { PackBase } from "./PackBase";
import { ProtoMap } from "./ProtoMap";
import { TimeDelay } from "../Util/TimeDelay";
import { DispatchEventNode, Func } from "../EventMgr/DispatchEventNode";


const { ccclass, property } = cc._decorator;
export class NetMgr extends DispatchEventNode
{
    public httpUrl: string = "http://39.107.84.87:9100/?"
    private static mInstance: NetMgr;
    private mTimeout = 10//默认十秒
    private mHeartTimeout = 10
    private pbkill = require("./pbkiller/src/pbkiller")
    public static get Instance()
    {
        if (this.mInstance == null)
        {
            let no = new cc.Node("netMgr")
            cc.game.addPersistRootNode(no);
            this.mInstance = no.addComponent(NetMgr)
        }
        return this.mInstance
    }
    @property
    ip: string = 'ws://39.107.84.87:9023';
    start()
    {
        TimeDelay.Instance.Add(1, 0, this.CheckSendTimeOut, this)
    }

    onDestroy()
    {
        TimeDelay.Instance.Remove(this.CheckSendTimeOut, this)
    }

    update(dt)
    {

    }
    init(callBack)
    {
        this.pbkill.preload(() =>
        {
            if (callBack)
            {
                callBack()
            }
        })
    }

    private CheckSendTimeOut()
    {
        if (this.mSendQueue.length > 0)
        {
            let array: Array<any> = new Array<any>()
            this.mSendQueue.forEach(element =>
            {
                if (Date.now() - element.sendTime > this.mTimeout * 1000)
                {
                    array.push(element)
                }
            });

            array.forEach(element =>
            {
                let index = this.mSendQueue.indexOf(element)
                if (index != -1)
                {
                    this.mSendQueue.splice(index, 1)
                }
                this.msgTimeOut(element.head)
            });
        }
    }

    public AddProto(pbName: string, protoNames: Array<string>): void
    {

        for (let key in protoNames)
        {
            let protoName = protoNames[key]
            let _class = this.pbkill.loadFromFile(pbName, protoName)
            ProtoMap.Add(protoName, _class)
        }
    }

    private socket: WebSocket = null
    public connect(wsurl = null)
    {
        wsurl = wsurl == null ? this.ip : wsurl
        if (this.socket == null)
        {

            this.socket = new WebSocket(wsurl)
            this.socket.binaryType = "arraybuffer"
            this.socket.onopen = this.onopen.bind(this)
            this.socket.onerror = this.onerror.bind(this)
            this.socket.onmessage = this.onmessage.bind(this)
            this.socket.onclose = this.onclose.bind(this)
        }
        else
        {
            if (this.socket.readyState == WebSocket.OPEN)
            {
                this.onopen(null)
            }
            else
            {
                this.socket = new WebSocket(wsurl)
                this.socket.binaryType = "arraybuffer"
                this.socket.onopen = this.onopen.bind(this)
                this.socket.onerror = this.onerror.bind(this)
                this.socket.onmessage = this.onmessage.bind(this)
                this.socket.onclose = this.onclose.bind(this)
            }
        }
    }

    private lastActivityTime
    private heartbeatIntervalTimeId
    private checkHeartbeatTimeOutIntervalTimeId
    private onopen(ev: Event)
    {
        
        TimeDelay.Instance.Remove(this.sendHeartbeat, this)
        TimeDelay.Instance.Remove(this.checkHeartbeat, this)
        TimeDelay.Instance.Add(3, 0, this.sendHeartbeat, this)
        TimeDelay.Instance.Add(3, 0, this.checkHeartbeat, this)
        this.mIsConnect = true
        this.lastActivityTime = Date.now()
        this.DispatchEventByType(NetMgrEventDef.onopen);
    }

    private mIsConnect: boolean = false
    public isConnect(): boolean
    {
        return this.socket != null && this.mIsConnect
    }
    private disConnect(msgType, msg)
    {
        if (this.mSendQueue)
        {
            this.mSendQueue.splice(0, this.mSendQueue.length)
        }
        if (this.isConnect())
        {
            this.mIsConnect = false
            this.socket.close()
        }
        else
        {
            this.mIsConnect = false
        }
        this.socket = null
        TimeDelay.Instance.Remove(this.sendHeartbeat, this)
        TimeDelay.Instance.Remove(this.checkHeartbeat, this)
        let data = { type: msgType, msg: msg }
        this.DispatchEventByType(NetMgrEventDef.disConnect, data)
    }

    private onerror(ev: Event)
    {
        this.disConnect(NetMgrEventDef.onerror, "与服务器连接失败")
    }

    private onclose(ev: Event)
    {
        this.disConnect(NetMgrEventDef.onclose, "与服务器连接断开")
    }

    private onmessage(ev: MessageEvent)
    {

        let data = ev.data
        let head: PackBase
        //try 
        {
            head = ProtoMap.UnPackHead(data)
            if (head != null)
            {
                this.lastActivityTime = Date.now()

                if (head.cmd != 1)
                {
                    this.distributeMsg(head)
                }
                else
                {
                    //console.log("收到心跳包")
                }
            }
            else
            {
                console.error("协议解析失败")
            }
        } //catch (error) 
        // {
        //     console.error("协议解析失败")
        //     this.disConnect("onerror","解析消息失败")
        // }
    }

    private mMsgId = 0
    private get Msgid()
    {
        return this.mMsgId++;
    }

    private mSendQueue: Array<any> = new Array()
    private sendHeartbeat()
    {
        if (this.isConnect())
        {
            //console.log("发送一次心跳" + Date.now())
            this.Send(1)
        }
    }

    private checkHeartbeat()
    {
        if (Date.now() - this.lastActivityTime > 10 * 1000)
        {
            this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时")
        }
    }

    private msgTimeOut(head: PackBase)
    {
        if (head.cmd == 1)
        {
            this.disConnect(NetMgrEventDef.HeartbeatTimeOut, "与服务器连接超时")
        }
        else
        {
            let ev = new ResponseMessageEvent(head.cmd.toString())
            head.errorcode = -1
            ev.SetData(head, null)

            console.error("消息返回超时id=" + head.cmd)
            this.node.dispatchEvent(ev)
        }
    }

    public SendGet(url, callback: Func)
    {
        url = this.httpUrl + url
        console.log(url)
        let flag = false;
        let request = cc.loader.getXMLHttpRequest();
        request.open("GET", url, true);
        request.timeout = 5000;
        request.onreadystatechange = function ()
        {
            if (request.readyState === 4 && (request.status == 200 && request.status < 300))
            {
                let respone = request.responseText;
                let data: HttpRespData = null
                try
                {
                    if (respone != null)
                    {
                        data = JSON.parse(respone)
                    }
                } catch (error)
                {
                    console.error("请求发生错误：url=" + url + "//error=" + error);
                }
                console.log("请求登录返回成功")
                callback.Invoke(data);
            }
        }
        request.onerror = function (ev: ProgressEvent)
        {
            console.error("请求发生错误：url=" + url);
            callback.Invoke(null);
        }
        request.ontimeout = function (e)
        {
            console.error("请求超时：url=" + url);
            callback.Invoke(null);
        }
        request.send();
    }

    public Send(id: number, data: any = null)
    {

        let head = new PackBase()
        head.cmd = id
        head.errorcode = 0
        head.msgid = this.Msgid
        let sendData =
            {
                head: head,
                sendTime: Date.now()
            }

        if (this.isConnect())
        {
            let buffer: ArrayBuffer = ProtoMap.Pack(head, data)
            if (id != 1) 
            {
                console.log("发送消息给服务器》")
                console.log(head)
                console.log(data)
                this.mSendQueue.push(sendData)
            }
            this.socket.send(buffer)
        }
        else
        {
            console.error("网络断开无法发送消息");
        }
    }

    private distributeMsg(head: PackBase)
    {
        let msg = ProtoMap.UnPack(head)
        console.log("收到服务返回的消息信息头：")
        console.log(head)
        if (head.errorcode != null && head.errorcode != 0)
        {
            console.warn("服务器返回错误码  消息id：" + head.cmd + "/errorcode=" + head.errorcode)
        }
        if (head == null || head.cmd == null)
        {
            console.warn("服务器返回无效的cmdid")
        }
        else
        {
            let index = this.mSendQueue.findIndex((obj, index, any) => 
            {
                return obj.head.msgid == head.msgid && obj.head.cmd == head.cmd
            })
            if (index != -1)
            {
                this.mSendQueue.splice(index, 1)
            }
            let ev = new ResponseMessageEvent(head.cmd.toString())
            ev.SetData(head, msg)
            this.DispatchEvent(ev)
        }
    }

}
export class NetMgrEventDef
{
    public static disConnect: string = "disConnect";
    public static onerror: string = "onerror"
    public static onclose: string = "onclose"
    public static onopen: string = "onopen"
    public static HeartbeatTimeOut: string = "HeartbeatTimeOut"
}

export type HttpRespData =
    {
        msg: string,
        errorcode: number,
        data: any,
    }
