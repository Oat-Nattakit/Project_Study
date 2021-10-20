// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


interface Enemy_Defeult_Data {

    PrefabsEnemy: cc.Prefab;
    MinEnemy: number;
    MaxEnemy: number;
    Enemy_region: cc.Node
    //CountTime_SpEnemy: number;
}

export class CreateEnemy implements Enemy_Defeult_Data {

    PrefabsEnemy: cc.Prefab;
    MinEnemy: number;
    MaxEnemy: number;
    Enemy_region: cc.Node
    //CountTime_SpEnemy: number;

    constructor(Prefabs: cc.Prefab, Min: number, Max: number, region: cc.Node/*, Time_Sp: number*/) {

        this.PrefabsEnemy = Prefabs;
        this.MinEnemy = Min;
        this.MaxEnemy = Max;
        this.Enemy_region = region;
        //this.CountTime_SpEnemy = Time_Sp;
    }
}


export class Spawner_Enemy {

    All_PositionEnemy: cc.Vec2[];
    Current_PositionEnemy: cc.Vec2[];
    CountEnemy: number;
    CreateEnemy: CreateEnemy;
    InterVal_Value: number;
    CountTime: number;

    constructor(Enemydata: CreateEnemy) {
        this.All_PositionEnemy = new Array();

        this.Current_PositionEnemy = new Array();
        this.CreateEnemy = Enemydata;
        this.CountEnemy = 0;
        this.CountTime = 0;
    }

    public Enemy_SetPosition() {

        for (let i = 0; i < this.CreateEnemy.MaxEnemy; i++) {
            let PreSp = cc.instantiate(this.CreateEnemy.PrefabsEnemy);
            PreSp.parent = this.CreateEnemy.Enemy_region;
        }

        let WaitTime = 10;
        setTimeout(() => { this.ColletPosition(), WaitTime });
    }

    private ColletPosition() {

        for (let i = 0; i < this.CreateEnemy.Enemy_region.childrenCount; i++) {
            this.All_PositionEnemy.push(this.CreateEnemy.Enemy_region.children[i].getPosition());
        }

        this.CreateEnemy.Enemy_region.destroyAllChildren();
        this.CreateEnemy.Enemy_region.getComponent(cc.Layout).enabled = false;

        for (let i = 0; i < this.CreateEnemy.MinEnemy; i++) {
            this.RanPositionEnemy();
        }
    }

    public RanPositionEnemy() {

        let En_Pos = Math.floor(Math.random() * this.All_PositionEnemy.length);
        this.Spawn_Enemy(this.All_PositionEnemy[En_Pos]);
        this.All_PositionEnemy.splice(En_Pos, 1);
    }

    private Spawn_Enemy(PosSP: cc.Vec2) {

        let Enemy_ = cc.instantiate(this.CreateEnemy.PrefabsEnemy);
        Enemy_.parent = this.CreateEnemy.Enemy_region;
        Enemy_.setPosition(PosSP);
        let EnemyScaleUp = cc.scaleTo(0.5, 1, 1);
        Enemy_.runAction(EnemyScaleUp);
        this.CountEnemy++;

        let WaitTime = 1
        setTimeout(() => { this.SetEnemy_IN_Array(), WaitTime });
    }

    public GetPosition_StandbyPush(PositionNode: cc.Vec2) {

        let WaitTime = 1;
        setTimeout(() => { this.All_PositionEnemy.push(PositionNode), WaitTime });
    }

    private SetEnemy_IN_Array() {

        this.Current_PositionEnemy.push(this.CreateEnemy.Enemy_region.children[this.CreateEnemy.Enemy_region.childrenCount - 1].getPosition());
    }

    public StartTime_Interval() {

        this.InterVal_Value = setInterval(() => this.SpawnTime(), 7);

    }

    private SpawnTime() {

        let DeltaTime = 0.007;
        let RateSpawnTime = 0.6;

        this.CountTime += DeltaTime;
        let Case_EnemyMorethan_20 = (this.CountEnemy >= 20 && this.CountEnemy < this.CreateEnemy.MaxEnemy && this.CountTime >= RateSpawnTime);

        if (this.CountEnemy < 20) {            
            this.SpawnEnemyToGame();           
        }
        else if (Case_EnemyMorethan_20) {
            this.SpawnEnemyToGame();           
        }
    }

    private SpawnEnemyToGame() {

        this.CountTime = 0;
        this.RanPositionEnemy();
    }
    public StopTime_Interval() {
        clearInterval(this.InterVal_Value);
    }


}
