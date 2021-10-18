// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player_Manager extends cc.Component {

    private Right: boolean;
    private Left: boolean;
    private SpawnBullect : boolean;

    private LimitMove = 0;
    private CountTime = 0;

    private Player_Obj: cc.Node;

    private GameControl: GameControl;

    onLoad() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.Player_Obj = this.node;        
    }

    start() {
        this.GameControl = GameControl.Instance;  
       this.LimitMove = this.GameControl.Canvas_Node.getComponent(cc.Canvas).designResolution.width;   
    }

    update(dt) {

        if (this.GameControl.GameRunning == true) {

            this.Player_Movement(dt);

            if (this.SpawnBullect == true) {
                this.CountTime += dt;
                if (this.CountTime >= this.GameControl.Fire_Rate) {
                    this.Spawn_Bullect();
                    this.CountTime = 0;
                }
            }
        }
    }


    private Player_Movement(dt) {

        if (this.Right == true) {
            let LimitRight = (this.Player_Obj.getPosition().x <= (this.LimitMove / 2) - (this.Player_Obj.width) * 0.3)
            if (LimitRight) {
                this.Player_Obj.x += this.GameControl.Speed * dt;
            }
        }
        else if (this.Left == true) {
            let LimitLeft = (this.Player_Obj.getPosition().x >= -(this.LimitMove / 2) + (this.Player_Obj.width) * 0.3)
            if (LimitLeft) {
                this.Player_Obj.x -= this.GameControl.Speed * dt;
            }
        }
    }

    private Spawn_Bullect() {

        let Bullect_ = cc.instantiate(this.GameControl.Prefabs_Bullet);
        this.GameControl.Sound_Setting.SFX_Sound.play();
        Bullect_.parent = this.GameControl.Canvas_Node;
        Bullect_.setPosition(this.Player_Obj.x, this.Player_Obj.y + 100);
    }

    private onKeyDown(event) {

        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.Right = true;
                break;

            case cc.macro.KEY.left:
                this.Left = true;
                break;

            case cc.macro.KEY.space:
                this.SpawnBullect = true;
                break;

        }
    }
    private onKeyUp(event) {

        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.Right = false;
                break;

            case cc.macro.KEY.left:
                this.Left = false;
                break;

            case cc.macro.KEY.space:
                this.SpawnBullect = false;
                break;
        }
    }
}
