// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.AudioSource)
    public SFX_: cc.AudioSource = null;

    private PlayerCon: cc.Node;
    private GetMainScripts: GameControl;

    private HitTime = 0;

    private PlayerHit: boolean = false;

    public CountHit = 0;

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start() {
        this.GetMainScripts = GameControl.Instance;
    }

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

    private Cal_PlayerHealt() {
        this.GetMainScripts.PlayerHealth--;
        this.HitTime = 0;
        this.PlayerHit = true;
        this.GetMainScripts.ComBoHitEnemy(false);
        this.GetMainScripts.Pos_Health.children[this.GetMainScripts.Pos_Health.childrenCount - 1].destroy();
        if (this.GetMainScripts.PlayerHealth <= 0) {
            this.GetMainScripts.GameOver();
        }
    }
}
