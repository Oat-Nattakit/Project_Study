// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;
@ccclass
export default class TestScripts extends cc.Component {

    LimitMoveRight = 0;
    LimitMoveLeft = 0;
    PlayerPositon = 0;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.LimitMoveRight = this.node.getParent().width * 0.4;
        this.LimitMoveLeft = -this.node.getParent().width * 0.4;
        this.PlayerPositon = this.node.getPosition().y;
    }

    setFunction(value) {
        let n = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.1, 0.8, 1.2),
                cc.moveTo(0.1, 0, 10)
            ),
            cc.spawn(
                cc.scaleTo(0.2, 1, 1),
                //cc.moveTo(0.2, 0, 0)
            ),          
            cc.spawn(
                cc.scaleTo(0.1, 1.2, 0.8),
                //cc.moveTo(0.1, 0, -10)
            ),
            cc.spawn(
                cc.scaleTo(0.2, 1, 1),
                cc.moveTo(0.2, 0, 0)
            )     
        ).repeatForever();
        this.node.runAction(n);

        /*cc.tween(this.node)            
            .to(0.1, { position: cc.v2(this.node.getPosition().x += value, this.PlayerPositon) })
            .start()
            .repeatForever();*/

    }
    setFunction2(value) {
        cc.tween(this.node)
            .to(0.1, { position: cc.v2(this.node.getPosition().x -= value, this.PlayerPositon) })
            .start()
            .repeatForever();

    }

    setStop() {
        cc.director.getActionManager().removeAllActions();
    }



    private onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.setFunction(100);
                break;
            case cc.macro.KEY.left:
                this.setFunction2(100);
                break;

        }
    }



}


