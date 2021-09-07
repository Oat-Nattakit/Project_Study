// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import GameControl from "./GameControl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {

    @property(cc.BoxCollider)
    Box: cc.BoxCollider = null;

    PlayerCon: cc.Node;
    GetSc: GameControl;

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.PlayerCon = cc.find("ObjectController");
        this.GetSc = this.PlayerCon.getComponent(GameControl);
    }    

    onCollisionEnter(other, self) {
        if (other.tag == 2) {
            this.GetSc.EN_SpawnPos.push(this.node.getPosition());
            this.node.destroy();
            this.GetSc.CallScore();
        }
    }

    public En_Bullect() {
        var Bullect_ = cc.instantiate(this.GetSc.PrefabsFile);
        Bullect_.color = cc.Color.RED;
        Bullect_.parent = this.GetSc.MainNode;
        Bullect_.setPosition(this.node.x, this.node.y - 100);
        Bullect_.getComponent(Bullet).ObjCol.tag = 3;
        Bullect_.getComponent(Bullet).typeEn = true;
        Bullect_.getComponent(Bullet).node.group = 'Enemy';
        setTimeout(function () {
            Bullect_.destroy();
        }.bind(this), 4000);
    }
}
