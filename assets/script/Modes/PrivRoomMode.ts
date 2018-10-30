import { IMode } from "../../YK/core/ModeMgr/ModeMgr";
import { loginReq, UserData, loginResp, PrivateDeskInfoReply, ParamConfigList, roomIdData, MatchPlayer, CallOpInfo } from "../Defs/CodingTips";
import { NetMgr, HttpRespData } from "../../YK/core/Net/NetMgr";
import { ProtocolDef, ActionType } from "../Defs/ProtocolDef";
import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";
import { Func } from "../../YK/core/EventMgr/DispatchEventNode";

export class PrivRoomMode extends IMode
{

    public privRoomData: PrivateDeskInfoReply
    public OnInitData(param: any): void
    {
        console.log("PrivRoomMode init")
        this.privRoomData = null
        this.eventMgr.setNetCallback(this.OnNetEvenet, 99)
        for (let index = ActionType.CreatePrivRoomReq; index <= ActionType.loginPirvRoomEvent; index++)
        {
            console.log("add event =" + index)
            this.eventMgr.addNetEvent(index);
        }
    }
    public OnClear(): void
    {
    }

    public OnDestroy(): void
    {
        super.OnDestroy()
    }



    public OnNetEvenet(ev: ResponseMessageEvent)
    {
        console.log("get=" + ev.Data.head.cmd)
        if (ev.Data.head.errorcode == 0)
        {
            if (ev.Data.head.cmd == 200)
            {
                //this.OnLoginResp(ev.Data.msg)
            }
            else if (ev.Data.head.cmd == ActionType.CreatePrivRoomReq)
            {
                this.privRoomData = ev.Data.msg;
                console.log("创建房间返回");
                console.log(ev);
                console.log(this.privRoomData)
            }
            else if (ev.Data.head.cmd == ActionType.LoginPirvRoom)
            {
                this.privRoomData = ev.Data.msg;
                console.log("加入房间返回");
                console.log(ev);
            }
            else if (ev.Data.head.cmd == ActionType.loginPirvRoomEvent)
            {
                console.log("进入私人房主推");
                console.log(ev);
                this.UpdateMatchPlayerData(ev.Data.msg);
            }
            else if (ev.Data.head.cmd == ActionType.userReadyEvent)
            {
                console.log("玩家准备主推");
                console.log(ev);
                //this.UpdateMatchPlayerData(ev.Data.msg);
                this.UpdataPlayerState(ev.Data.msg)
            }
        }
        else
        {
            console.log("Error=" + ev.Data.head.cmd)
        }

    }

    /**
     * 更新玩家状态
     * @param data 返回的值
     */
    public UpdataPlayerState(data:CallOpInfo)
    {
        let playerIndexAndData = this.FindPlayerIndexAndData(data.seat)
        if(playerIndexAndData != null)
        {
            console.log("前  更新玩家数据")
            console.log(this.privRoomData.matchPlayers[playerIndexAndData.index])
            this.privRoomData.matchPlayers[playerIndexAndData.index].state = data.value
            console.log("后  更新玩家数据")
            console.log(this.privRoomData.matchPlayers[playerIndexAndData.index])
        }
    }

    /**
     * 更新玩家数据
     * @param playerData 要更新的玩家数据
     */
    public UpdateMatchPlayerData(playerData: MatchPlayer)
    {
        if (this.privRoomData != null && this.privRoomData.matchPlayers != null)
        {
            console.log("前  更新玩家数据")
            console.log(this.privRoomData.matchPlayers)
            let playerIndexAndData = this.FindPlayerIndexAndData(playerData.seat)
            if(playerIndexAndData != null)
            {
                this.privRoomData.matchPlayers[playerIndexAndData.index] = playerData
            }
            else
            {
                this.privRoomData.matchPlayers.push(playerData)
            }
            console.log("后  更新玩家数据")
            console.log(this.privRoomData.matchPlayers)
        }
    }

    /**
     * 查找玩家信息
     * @param seat 座位
     */
    public FindPlayerIndexAndData(seat:number)
    {
        let retData = null;
        let index = this.privRoomData.matchPlayers.findIndex(da => {
              if(da.seat ==seat)
              {
                  retData = da
                  return true
              }
              return false
            })
        if(index != -1)
        {
            return {index:index,data:retData}
        }
        
        return null
    }

    /**
     * 发送创建房间
     * @param data 
     */
    public SendCreateRoom(data: ParamConfigList)
    {
        //let sendData: ParamConfigList = { datas : null }
        NetMgr.Instance.Send(ActionType.CreatePrivRoomReq, data)
    }

    /**
     * 发送加入房间
     */
    public SendJoinRoom(roomId: number)
    {
        let sendData: roomIdData = { roomId: roomId }
        NetMgr.Instance.Send(ActionType.LoginPirvRoom, sendData)
    }

    /**
     * 发送玩家准备
     */
    public SendUserReady()
    {
        NetMgr.Instance.Send(ActionType.userReady, null)
    }



    // public SendHttpLogin(account: string, pwd: string, callBack: Func)
    // {
    //     NetMgr.Instance.SendGet("modeName=account&api=login&account=" + account + "&pwd=" + pwd, new Func(this, (res: HttpRespData) =>
    //     {
    //         if (res != null && res.errorcode == 0)
    //         {
    //             this.accountInfo.token = res.data.token
    //             this.accountInfo.userid = res.data.userid
    //         }
    //         if (callBack != null)
    //         {
    //             callBack.Invoke(res)
    //         }
    //     }));
    // }



}