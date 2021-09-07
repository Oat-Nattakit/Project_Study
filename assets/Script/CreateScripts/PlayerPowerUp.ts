// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerPowerUp extends cc.Component {

    @property(cc.Prefab)
    Speed_Up: cc.Prefab = null;

    @property(cc.Prefab)
    Increed_Sp: cc.Prefab = null;

    GetTime = 0;
    GetSc: GameControl;

    Get: cc.Node;
    Spawn: boolean = false;
    Curve = 0;
    Swing: boolean = false;

    onLoad() {
        this.GetSc = this.node.getComponent(GameControl);
    }

    SpawnBuff() {
        var Sp = cc.instantiate(this.Speed_Up);
        Sp.parent = this.GetSc.MainNode;
        Sp.setPosition(-(this.GetSc.MainNode.width * 0.5), (this.GetSc.MainNode.width * 0.1));
        this.GetTime = 0;
        this.Get = Sp;
        this.Spawn = true;
    }

    update(dt) {

        if (this.Spawn == false) {
            this.GetTime += dt;
            if (this.GetTime >= 10) {
                this.SpawnBuff();
            }
        }

        if (this.Spawn == true) {
            this.Curve += dt;

            if (this.Curve >= 0.5) {
                if (this.Swing == false) {
                    this.Swing = true;
                }
                else {
                    this.Swing = false;
                }
                this.Curve = 0;
            }
            else {
                if (this.Swing == false) {
                    this.Get.y += dt * 100;
                }
                else {
                    this.Get.y -= dt * 100;
                }
            }
            this.Get.x += dt * 150;
        }

        if (this.Get.x >= (this.GetSc.MainNode.width * 0.7)) {
            this.Get.destroy();
            this.Spawn = false;
        }
    }
}
