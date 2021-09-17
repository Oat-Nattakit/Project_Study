// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {    

    @property(cc.Collider)
    ObjCol: cc.Collider = null;

    public typeEn: boolean = false;

    private GetMainScripts: GameControl;
    private Bullet_LimitMove = 0;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.GetMainScripts = GameControl.Instance;

        this.Bullet_LimitMove = this.GetMainScripts.Canvas_Node.height * 0.5;
    }

    start() {
        if (this.typeEn == false) {            
            let Bullet_Player = cc.moveTo(1, this.node.x, this.Bullet_LimitMove);
            this.Bullet_Movement(Bullet_Player);            
        }
        else {
            let Bullet_Enemy = cc.moveTo(1, this.node.x, -(this.Bullet_LimitMove));
            this.Bullet_Movement(Bullet_Enemy);            
        }
    }    

    private Bullet_Movement(Move_Action : cc.ActionInterval){

        let Move_OutRange = cc.sequence(Move_Action,cc.destroySelf());
        this.node.runAction(Move_OutRange);
    }

    onCollisionEnter(other, self) {

        if (other.tag == 3) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == 1) {
            this.SpawnEFX();
            this.node.destroy();
        }
        if (other.tag == 4) {
            this.GetMainScripts.PowerUp.Player_Get_Buff();
            this.SpawnEFX();
            this.node.destroy();
        }
    }

    private SpawnEFX() {
        let EFX_ = cc.instantiate(this.GetMainScripts.EFX);
        EFX_.setParent(this.GetMainScripts.Canvas_Node);
        EFX_.setPosition(this.node.getPosition());
        setTimeout(function () {
            EFX_.destroy()
        }.bind(this), 100);
    }
}
