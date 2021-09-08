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
    private Obj_Swing: boolean = false;

    private Curve_Time = 0;
    private Buff_Number = 0;
    private SpeedBuff = 150;

    private RangeWidth = 0;
    private RangeHight = 0;

    onLoad() {
        this.GetMainScripts = this.node.getComponent(GameControl);

        this.RangeWidth = this.GetMainScripts.Canvas_Node.width * 0.5;
        this.RangeHight = this.GetMainScripts.Canvas_Node.height * 0.1;
    }

    private SpawnBuff() {
        this.Buff_Number = Math.floor(Math.random() * 2);
        this.Buff_Obj = cc.instantiate(this.BuffPrefabs);
        this.Buff_Obj.children[this.Buff_Number].active = true;
        this.Buff_Obj.parent = this.GetMainScripts.Canvas_Node;
        this.RandomPositionBuff();
        this.GetTime = 0;
        this.Spawn_Buff = true;
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
                this.Curve_Time += dt;

                if (this.Curve_Time >= 0.5) {
                    this.SwitchDiraction_Y();
                    this.Curve_Time = 0;
                }
                else {
                    if (this.Obj_Swing == false) {
                        this.Buff_Obj.y += dt * 100;
                    }
                    else {
                        this.Buff_Obj.y -= dt * 100;
                    }
                }

                this.Buff_Obj.x += dt * this.SpeedBuff;

                if (this.Buff_Obj.x >= (this.GetMainScripts.Canvas_Node.width * 0.7)) {
                    this.Buff_Obj.destroy();
                    this.Spawn_Buff = false;
                }
            }
        }
    }

    private SwitchDiraction_Y() {
        
        if (this.Obj_Swing == true) {
            this.Obj_Swing = false;
        }
        else {
            this.Obj_Swing = true
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
    }
}
