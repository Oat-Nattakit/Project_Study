// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioSource)
    SFX_: cc.AudioSource = null;

    PlayerCon: cc.Node;
    GetSc: GameControl;    

    HitTime = 0;

    PlayerHit: boolean = false;

    onLoad() {

        this.PlayerCon = cc.find("ObjectController");
        this.GetSc = this.PlayerCon.getComponent(GameControl);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    public CountHit = 0;

    update(dt) {

        if (this.PlayerHit == true) {
            this.HitTime += dt;
            this.node.color = cc.Color.RED;
            if (this.HitTime >= 0.2) {
                this.node.color = cc.Color.WHITE;
                this.HitTime = 0;
                this.PlayerHit = false;
            }
        }
    }

    onCollisionEnter(other, self) {
        if (other.tag == 3) {
            this.Cal_PlayerHealt();
        }
    }

    Cal_PlayerHealt() {
        this.GetSc.PlayerHealth--;
        this.HitTime = 0;        
        this.PlayerHit = true;
        this.GetSc.ComBoHitEnemy(false);
        this.GetSc.Pos_Health.children[this.GetSc.Pos_Health.childrenCount - 1].destroy();
        if (this.GetSc.PlayerHealth <= 0) {
            this.GetSc.GameOver();
        }
    }
}
