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
    BuffPrefabs: cc.Prefab = null;    

    GetTime = 0;
    GetSc: GameControl;

    Get: cc.Node;
    Spawn: boolean = false;
    Curve = 0;
    Swing: boolean = false;
    Buff_Number = 0;
    SpeedBuff = 0;


    onLoad() {
        this.GetSc = this.node.getComponent(GameControl);
    }

    SpawnBuff() {
        this.Buff_Number = Math.floor(Math.random() * 2);
        this.Get = cc.instantiate(this.BuffPrefabs);       
        this.Get.children[this.Buff_Number].active = true;
        this.Get.parent = this.GetSc.MainNode;
        this.RandomPositionBuff();        
        this.GetTime = 0;        
        this.Spawn = true;
    }

    RandomPositionBuff(){
        let Ran_Num = Math.floor(Math.random() * 2);
        if(Ran_Num == 0){
            this.Get.setPosition(-(this.GetSc.MainNode.width * 0.5), (this.GetSc.MainNode.width * 0.1));     
            this.SpeedBuff = 150;       
        }
        else{
            this.Get.setPosition((this.GetSc.MainNode.width * 0.5), (this.GetSc.MainNode.width * 0.1));   
            this.SpeedBuff = -150;          
        }
    }

    update(dt) {
        if (this.GetSc.GameRunning == true) {
            if (this.Spawn == false) {
                this.GetTime += dt;
                if (this.GetTime >= 10) {
                    this.SpawnBuff();
                }
            }

            if (this.Spawn == true) {
                this.Curve += dt;

                if (this.Curve >= 0.5) {
                    this.SwitchDiraction_Y();
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
                this.Get.x += dt * this.SpeedBuff;

                if (this.Get.x >= (this.GetSc.MainNode.width * 0.7)) {
                    this.Get.destroy();
                    this.Spawn = false;
                }
            }
        }
    }

    SwitchDiraction_Y() {
        if (this.Swing == true) {
            this.Swing = false;
        }
        else {
            this.Swing = true
        }
    }

    public BuffPlayerActive() {
        this.Get.destroy();
        this.Spawn = false;
        if (this.Buff_Number == 0) {            
            this.GetSc.Speed += 100;           
        }
        else if (this.Buff_Number == 1) {           
            this.GetSc.Fire_Rate -= 0.05;           
        }
    }
}
