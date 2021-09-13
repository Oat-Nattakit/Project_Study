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
    private BuffPrefabs: cc.Prefab = null;

    private GetTime = 0;
    private GetMainScripts: GameControl;

    private Buff_Obj: cc.Node;

    private Spawn_Buff: boolean = false;

    private Curve_Time = 0.5;
    private Buff_Number = 0;
    private SpeedBuff = 150;

    private RangeWidth = 0;
    private RangeHight = 0;

    private Random_Rate = [10, 40, 50]
    private CountRate = 0;

    onLoad() {
        
        this.GetMainScripts = this.node.getComponent(GameControl);

        this.RangeWidth = this.GetMainScripts.Canvas_Node.width * 0.5;
        this.RangeHight = this.GetMainScripts.Canvas_Node.height * 0.1;

        for (let i = 0; i < this.Random_Rate.length; i++) {
            this.CountRate += this.Random_Rate[i];
        }
    }

    private SpawnBuff() {

        this.RandomBuffPlayer();        
        this.Buff_Obj = cc.instantiate(this.BuffPrefabs);
        this.Buff_Obj.children[this.Buff_Number].active = true;
        this.Buff_Obj.parent = this.GetMainScripts.Canvas_Node; 

        this.BuffObject_Movement();
        this.RandomPositionBuff();

        this.GetTime = 0;
        this.Spawn_Buff = true;
    }

    private RandomBuffPlayer() {

        let Random_Value = Math.floor(Math.random() * this.CountRate);

        if (Random_Value <= this.Random_Rate[0]) {
            this.Buff_Number = 0;
        }
        else if (Random_Value > this.Random_Rate[0] && Random_Value <= this.Random_Rate[1]) {
            this.Buff_Number = 1;
        }
        else if (Random_Value > this.Random_Rate[1] && Random_Value <= this.Random_Rate[2]) {
            this.Buff_Number = 2;
        }
    }

    private RandomPositionBuff() {

        let Ran_Num = Math.floor(Math.random() * 2);

        if (Ran_Num == 0) {
            this.Buff_Obj.setPosition(-this.RangeWidth, this.RangeHight);
            this.SpeedBuff = 150;
        }
        else {
            this.Buff_Obj.setPosition(this.RangeWidth, this.RangeHight);
            this.SpeedBuff = -150;
        }
    }

    update(dt) {

        if (this.GetMainScripts.GameRunning == true) {

            if (this.Spawn_Buff == false) {
                this.GetTime += dt;
                if (this.GetTime >= (Math.floor(Math.random() * 10) + 10)) {
                    this.SpawnBuff();
                }
            }

            if (this.Spawn_Buff == true) {

                this.Buff_Obj.x += dt * this.SpeedBuff;

                if (this.Buff_Obj.x >= (this.GetMainScripts.Canvas_Node.width * 0.7)) {
                    this.Buff_Obj.destroy();
                    this.Spawn_Buff = false;
                }
            }
        }
    }

    public BuffPlayerActive() {

        this.Buff_Obj.destroy();
        this.Spawn_Buff = false;

        if (this.Buff_Number == 0) {
            this.GetMainScripts.Speed += 100;
        }
        else if (this.Buff_Number == 1) {
            this.GetMainScripts.Fire_Rate -= 0.05;
        }
        else if (this.Buff_Number == 2) {
            this.GetMainScripts.PlayerPlusHealth();
        }
    }

    BuffObject_Movement() {

        let Scale_resize = cc.sequence(cc.scaleTo(0.4, 1.3, 1.3), cc.scaleTo(0.4, 0.8, 0.8)).repeatForever();
        this.Buff_Obj.runAction(Scale_resize);

        let SwingUp = cc.moveBy(this.Curve_Time, this.Buff_Obj.x, this.Buff_Obj.y + 50)
        let SwingDown = cc.moveBy(this.Curve_Time, this.Buff_Obj.x, this.Buff_Obj.y - 50)

        let BuffSwing_Move = cc.sequence(SwingUp, SwingDown).repeatForever();
        this.Buff_Obj.runAction(BuffSwing_Move);
    }
}
