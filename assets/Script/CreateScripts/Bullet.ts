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

    @property
    Speed_Bul = 100;

    PlayerCon: cc.Node;
    GetSc: GameControl;    

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.PlayerCon = cc.find("ObjectController");
        this.GetSc = this.PlayerCon.getComponent(GameControl);
    }

    @property(cc.Collider)
    ObjCol: cc.Collider = null;

    public typeEn: boolean = false;

    update(dt) {
        if (this.typeEn == false) {
            this.node.y += this.Speed_Bul * (dt * 10);
        }
        else {
            this.node.y -= this.Speed_Bul * (dt * 10);
        }
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
    }

    SpawnEFX() {
        var EFX_ = cc.instantiate(this.GetSc.EFX);
        EFX_.setParent(this.GetSc.MainNode);
        EFX_.setPosition(this.node.getPosition());
        setTimeout(function () {
            EFX_.destroy()
        }.bind(this), 100);
    }    
}
