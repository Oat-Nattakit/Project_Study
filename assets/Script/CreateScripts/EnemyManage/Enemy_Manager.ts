// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyControl from "./EnemyControl";



const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy_Manager extends cc.Component {

    @property(cc.Prefab)
    private PrefabsEnemy: cc.Prefab = null;

    @property(cc.Node)
    private Enemy_region: cc.Node = null;

    @property
    public MinEnemy: number = 20;
    @property
    public MaxEnemy: number = 30;
    @property
    public Enamy_FireRate: number = 1.5;

    public SpawnEnemy: Spawner_Enemy;
    private SetDataEnemy: CreateEnemy;

    private CountFireEN: number = 0;
    private CountTimePlay: number = 0;

    private GameRuning: boolean = false;

    public StartEnemy_Spawner() {
        this.SetDataEnemy = new CreateEnemy(this.PrefabsEnemy, this.MinEnemy, this.MaxEnemy, this.Enemy_region);
        this.SpawnEnemy = new Spawner_Enemy(this.SetDataEnemy);
        this.SpawnEnemy.Enemy_SetPosition();
    }

    public Start_Delta_Time(GameRuning: boolean) {

        this.GameRuning = GameRuning;
        if (GameRuning == true) {
            this.SpawnEnemy.StartTime_Interval();
        }
        else {
            this.SpawnEnemy.StopTime_Interval();
        }
    }

    public Random_EnemyPosition() {
        this.SpawnEnemy.Random_PositionEnemy();
    }

    public PushPositionEnemy(Enemy: cc.Node) {
        this.SpawnEnemy.DestoryEnemy(Enemy);
        this.SpawnEnemy.GetPosition_StandbyPush(Enemy.getPosition());
    }

    public UpdateCurrentEnemy(Value: number) {

        this.SpawnEnemy.CountEnemy += Value;
    }

    update(DeltaTime) {

        if (this.GameRuning == true) {

            this.Control_EnemyFire(DeltaTime);
            this.Increed_EnemyFireRate(DeltaTime);
        }

    }
    private Control_EnemyFire(DeltaTime: number) {

        this.CountFireEN += DeltaTime;
        if (this.CountFireEN >= this.Enamy_FireRate) {
            let En_FirePos = Math.floor(Math.random() * this.Enemy_region.childrenCount);
            this.Enemy_region.children[En_FirePos].getComponent(EnemyControl).En_Bullect();
            this.CountFireEN = 0;
        }
    }

    private Increed_EnemyFireRate(DeltaTime: number) {

        this.CountTimePlay += DeltaTime;

        let MaxFireRate = 0.2;
        let RoundTime_Increed = 20;

        if (this.CountTimePlay >= RoundTime_Increed && this.Enamy_FireRate >= MaxFireRate) {
            this.Enamy_FireRate -= 0.1;
            this.CountTimePlay = 0;
        }
    }
}
interface Enemy_Defeult_Data {

    PrefabsEnemy: cc.Prefab;
    MinEnemy: number;
    MaxEnemy: number;
    Enemy_region: cc.Node
}

class CreateEnemy implements Enemy_Defeult_Data {

    PrefabsEnemy: cc.Prefab;
    MinEnemy: number;
    MaxEnemy: number;
    Enemy_region: cc.Node

    constructor(Prefabs: cc.Prefab, Min: number, Max: number, region: cc.Node) {

        this.PrefabsEnemy = Prefabs;
        this.MinEnemy = Min;
        this.MaxEnemy = Max;
        this.Enemy_region = region;
    }
}


class Spawner_Enemy {

    All_PositionEnemy: cc.Vec2[];
    Current_PositionEnemy: cc.Vec2[];
    CountEnemy: number;
    CreateEnemy: CreateEnemy;
    InterVal_Value: number;
    CountTime: number;
    PoolNode: cc.NodePool;

    constructor(Enemydata: CreateEnemy) {
        this.All_PositionEnemy = new Array();

        this.Current_PositionEnemy = new Array();
        this.CreateEnemy = Enemydata;
        this.CountEnemy = 0;
        this.CountTime = 0;
        this.PoolNode = new cc.NodePool();
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

        for (let i = this.CreateEnemy.MaxEnemy; i >= 0; i--) {
            this.PoolNode.put(this.CreateEnemy.Enemy_region.children[i]);
        }        
        
        this.CreateEnemy.Enemy_region.getComponent(cc.Layout).enabled = false;

        for (let i = 0; i < this.CreateEnemy.MinEnemy; i++) {
            this.Random_PositionEnemy();
        }
    }

    public Random_PositionEnemy() {

        let En_Pos = Math.floor(Math.random() * this.All_PositionEnemy.length);
        this.Spawn_Enemy(this.All_PositionEnemy[En_Pos]);
        this.All_PositionEnemy.splice(En_Pos, 1);
    }

    private Spawn_Enemy(PosSP: cc.Vec2) {
        
        let Enemy_: cc.Node = null;
        if (this.PoolNode.size() > 0) {
            Enemy_ = this.PoolNode.get();
        }
        else {
            Enemy_ = cc.instantiate(this.CreateEnemy.PrefabsEnemy);
            this.PoolNode.put(Enemy_);            
        }
        
        Enemy_.parent = this.CreateEnemy.Enemy_region;
        Enemy_.setPosition(PosSP);
        Enemy_.getComponent(EnemyControl).StartEnemy();
        
        this.CountEnemy++;

        let WaitTime = 1
        setTimeout(() => { this.SetEnemy_IN_Array(), WaitTime });
    }

    public DestoryEnemy(Enemy: cc.Node) {
        this.PoolNode.put(Enemy);
    }


    public GetPosition_StandbyPush(PositionNode: cc.Vec2) {

        let WaitTime = 1;
        setTimeout(() => { this.All_PositionEnemy.push(PositionNode), WaitTime });
    }

    private SetEnemy_IN_Array() {

        this.Current_PositionEnemy.push(this.CreateEnemy.Enemy_region.children[this.CreateEnemy.Enemy_region.childrenCount - 1].getPosition());
    }

    public StartTime_Interval() {

        let DeltaTime = 7;
        this.InterVal_Value = setInterval(() => this.SpawnTime(), DeltaTime);

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
        this.Random_PositionEnemy();
    }
    public StopTime_Interval() {

        clearInterval(this.InterVal_Value);
    }


}
