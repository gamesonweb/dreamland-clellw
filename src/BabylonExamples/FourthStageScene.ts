import{
    Scene, 
    Engine, 
    FreeCamera,
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    ArcRotateCamera,
    AbstractMesh,
    PhysicsImpostor,
    ActionManager,
    ExecuteCodeAction,
    MeshBuilder,
    StandardMaterial,
    Color3,
    CubeTexture,
    Texture,
    Vector2,
    PBRMaterial,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class FourthStageScene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageFourScene();
        //this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }


    /* ************************************************************************* */
    //methods for stage four: 
    //Reimu starting position: this.Reimu.position = new Vector3(25,0,-17);
    //this.Reimu.scaling.setAll(0.1);


    CreateStageFourScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,1), scene);
        hemiLight.intensity = 1;

        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };

        const framesPerSecond = 60;
        const gravity = -9.81;
        scene.collisionsEnabled = true;
        scene.enablePhysics(new Vector3(0, gravity/framesPerSecond, 0));
        
        this.CreateCamera(scene);
        this.camera.position = new Vector3(10,10,0);
        this.CreateStageFourMap();

        this.CreateReimuStageFour();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:40});
        leftWall.position = new Vector3(20,10,-50);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;

        const rightWall = MeshBuilder.CreateBox("wall", {size:40});
        rightWall.position = new Vector3(20,10,25);
        rightWall.checkCollisions = true;
        rightWall.visibility = 0;

        const backWall = MeshBuilder.CreateBox("wall", {size:40});
        backWall.position = new Vector3(-12,10,-10);
        backWall.checkCollisions = true;
        backWall.visibility = 0;

        const forthWall = MeshBuilder.CreateBox("wall", {size:40});
        forthWall.position = new Vector3(53,10,-10);
        forthWall.checkCollisions = true;
        forthWall.visibility = 0;

        const ceilling = MeshBuilder.CreateBox("wall", {size:40});
        ceilling.position = new Vector3(17,50,-10);
        ceilling.checkCollisions = true;
        ceilling.visibility = 0;
        
        const ground = MeshBuilder.CreateBox("wall", {size:40});
        ground.position = new Vector3(17,-20,-10);
        ground.checkCollisions = true;
        ground.visibility = 0;
        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })
        window.addEventListener("resize", () => {
                this.engine.resize;
        });
        return scene;

    }

    async CreateStageFourMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_4.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
        });

        const sanae = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sanae.glb"
        );
        sanae.meshes[0].scaling.setAll(0.1);
        //sanae.meshes[0].position = new Vector3(20,0,-17);
        sanae.meshes[0].position = new Vector3(23,2,-17);
        sanae.meshes[0].rotate(Vector3.Up(), 3.1);
        sanae.meshes[0].rotate(Vector3.Up(), -Math.PI/2)
    }

    async CreateReimuStageFour(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(23,2,-8);
        this.Reimu.rotate(Vector3.Up(), -Math.PI/2);
        this.Reimu.scaling.setAll(0.1);
        this.camera.setTarget(meshes[2]);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();

        const flightSpeed = 0.05;
        const soarSpeed = 0.05;
        const focusFlightSpeed = 0.03;
        const rotationSpeed = 0.03;
        const normalAnimSpeed = 5;
        const focusAnimSpeed = 0.5;

        let speed: number;
        let animSpeed: number;
        let acceleration = 0;
        let soarAcceleration = 0;
        let rotationAcceleration = 0;

        const keyStatus = {
            z: false,
            s: false,
            q: false,
            d: false,
            c: false,
            v: false, 
            Shift: false
        };

        this.scene.actionManager = new ActionManager(this.scene);

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, 
            (event) => {
                let key = event.sourceEvent.key;
                if (key !== "Shift") {
                    key = key.toLowerCase();
                }
                if (key in keyStatus) {
                    keyStatus[key as keyof typeof keyStatus] = true;
                }
            }
            )
        );

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, 
            (event) => {
                let key = event.sourceEvent.key;
                if (key !== "Shift") {
                    key = key.toLowerCase();
                }
                if (key in keyStatus) {
                    keyStatus[key as keyof typeof keyStatus] = false;
                }
            }
            )
        );

        let moving = false;
        let soaring = false;
        let turning = false;
        let touched = 0;

        this.scene.onBeforeRenderObservable.add(() => {

            if(touched > 0) {
                    touched--;
                    this.Reimu.rotate(Vector3.Forward(), Math.PI/16);
            }
        else {
            if(keyStatus.z ||
            keyStatus.s ||
            keyStatus.q ||
            keyStatus.d ||
            keyStatus.c ||
            keyStatus.v) {
                moving = true;
                if(keyStatus.s && !keyStatus.z) {
                    acceleration = Math.max(acceleration-0.0025, -flightSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                else if(keyStatus.z || keyStatus.q || keyStatus.d) {
                    speed = !keyStatus.Shift ? flightSpeed : focusFlightSpeed;
                    animSpeed = !keyStatus.Shift ? normalAnimSpeed : focusAnimSpeed;
                    flightAnim.speedRatio = animSpeed;
                    acceleration = Math.min(acceleration+0.0025, speed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                if(keyStatus.q) {
                    turning = true;
                    rotationAcceleration = Math.max(rotationAcceleration-0.0005, -rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                else if(keyStatus.d) {
                    turning = true;
                    rotationAcceleration = Math.min(rotationAcceleration+0.0005, rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                if(keyStatus.c) {
                    soaring = true;
                    soarAcceleration = Math.min(soarAcceleration+0.005, soarSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.up.scaleInPlace(soarAcceleration));
                }
                else if(keyStatus.v) {
                    soaring = true;
                    soarAcceleration = Math.max(soarAcceleration-0.005, -soarSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.up.scaleInPlace(soarAcceleration));
                }
                flightAnim.start(
                    true, 
                    1, 
                    flightAnim.from, 
                    flightAnim.to, 
                    false
                );
            }
            else  {
                if(moving) {
                    idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
                    acceleration = 0;
                    flightAnim.stop();
                    moving = false; 
                }
            }
            if(!keyStatus.z && !keyStatus.s) {
                if(acceleration > 0) acceleration = Math.max(acceleration-0.005, 0);
                else if(acceleration < 0) acceleration = Math.min(acceleration+0.005, 0);
            }
            if(!keyStatus.q && !keyStatus.d) {
                if(rotationAcceleration > 0) rotationAcceleration = Math.max(rotationAcceleration-0.0005, 0);
                if(rotationAcceleration < 0) rotationAcceleration = Math.min(rotationAcceleration+0.0005, 0);

            }
            if(!keyStatus.c && !keyStatus.v) {
                if(soarAcceleration > 0) soarAcceleration = Math.max(soarAcceleration-0.005, 0);
                if(soarAcceleration < 0) soarAcceleration = Math.min(soarAcceleration+0.005, 0);

            }
        }
        });
        

        const mat = new StandardMaterial("mat");
        mat.diffuseColor = new Color3(0,0,1);
        const bull = MeshBuilder.CreateSphere("bull");
        bull.position = new Vector3(21,4,-15);
        (bull as AbstractMesh).material = mat;
        const bull2 = MeshBuilder.CreateSphere("bull");
        bull2.position = new Vector3(22,4,-15);
        (bull2 as AbstractMesh).material = mat;
        bull2.position._x += 0.4;
        const bull3 = MeshBuilder.CreateSphere("bull");
        bull3.position = new Vector3(24,4,-15);
        (bull3 as AbstractMesh).material = mat;
        bull3.position._x -= 0.4;
        const bull4 = MeshBuilder.CreateSphere("bull");
        bull4.position = new Vector3(25,4,-15);
        (bull4 as AbstractMesh).material = mat;
        const bull11 = MeshBuilder.CreateSphere("bull");
        bull11.position = new Vector3(24,3,-15);
        (bull11 as AbstractMesh).material = mat;
        const bull12 = MeshBuilder.CreateSphere("bull");
        bull12.position = new Vector3(23,2,-15);
        (bull12 as AbstractMesh).material = mat;
        bull12.position._y += 0.5;
        const bull13 = MeshBuilder.CreateSphere("bull");
        bull13.position = new Vector3(22,2,-15);
        (bull13 as AbstractMesh).material = mat;
        bull13.position._x -= 0.4;
        const bull21 = MeshBuilder.CreateSphere("bull");
        bull21.position = new Vector3(22,3,-15);
        (bull21 as AbstractMesh).material = mat;
        const bull22 = MeshBuilder.CreateSphere("bull");
        bull22.position = new Vector3(23,5,-15);
        (bull22 as AbstractMesh).material = mat;
        const bull31 = MeshBuilder.CreateSphere("bull");
        bull31.position = new Vector3(24,2,-15);
        (bull31 as AbstractMesh).material = mat;
        bull31.position._x += 0.4;

        
        let attackCycle = 299;
        const bulletSpeed = 0.1;
        let accel = 0.001;
        let accel1 = 0.001;
        let accel2 = 0.001;
        let accel3 = 0.001;
        let direction = this.Reimu.position.subtract(bull.position).normalize();
        let direction2 = this.Reimu.position.subtract(bull2.position).normalize();
        let direction3 = this.Reimu.position.subtract(bull3.position).normalize();
        let direction4 = this.Reimu.position.subtract(bull4.position).normalize();
        let direction11 = this.Reimu.position.subtract(bull11.position).normalize();
        let direction12 = this.Reimu.position.subtract(bull12.position).normalize();
        let direction13 = this.Reimu.position.subtract(bull13.position).normalize();
        let direction21 = this.Reimu.position.subtract(bull21.position).normalize();
        let direction22 = this.Reimu.position.subtract(bull22.position).normalize();
        let direction31 = this.Reimu.position.subtract(bull31.position).normalize();

        
        this.scene.onBeforeRenderObservable.add(() => {
            if(attackCycle == 0) {
                bull.position = new Vector3(21,4,-15);
                direction = this.Reimu.position.subtract(bull.position).normalize();
                attackCycle = 1000;
                accel = 0.001;
                accel1 = 0.001;
                accel2 = 0.001;
                accel3 = 0.001;
            }
            if(attackCycle == 980) {
                bull2.position = new Vector3(22,4,-15);
            }
            if(attackCycle == 960) {
                bull3.position = new Vector3(24,4,-15);
            }
            if(attackCycle == 940) {
                bull4.position = new Vector3(25,4,-15);
            }
            if(attackCycle == 925) {
                bull11.position = new Vector3(24,3,-15);
            }
            if(attackCycle == 910) {
                bull12.position = new Vector3(23,2,-15);
                bull12.position._y += 0.5;
            }
            if(attackCycle == 895) {
                bull13.position = new Vector3(22,2,-15);
                bull13.position._x -= 0.4;
            }
            if(attackCycle == 885) {
                bull21.position = new Vector3(22,3,-15);
            }
            if(attackCycle == 875) {
                bull22.position = new Vector3(23,5,-15);
            }
            if(attackCycle == 870) {
                bull31.position = new Vector3(24,2,-15);
                bull31.position._x += 0.4;
            }
            if(attackCycle == 800) {
                direction = this.Reimu.position.subtract(bull.position).normalize();
            }
            if(attackCycle <= 800) {
                bull.position.addInPlace(direction.scale(accel));
                accel = Math.min(accel+0.0002, bulletSpeed);
            }
            if(attackCycle == 760) {
                direction2 = this.Reimu.position.subtract(bull2.position).normalize();
            }
            if(attackCycle <= 760) {
                bull2.position.addInPlace(direction2.scale(accel));
            }
            if(attackCycle == 720) {
                direction3 = this.Reimu.position.subtract(bull3.position).normalize();
            }
            if(attackCycle <= 720) {
                bull3.position.addInPlace(direction3.scale(accel));
            }
            if(attackCycle == 680) {
                direction4 = this.Reimu.position.subtract(bull4.position).normalize();
            }
            if(attackCycle <= 680) {
                bull4.position.addInPlace(direction4.scale(accel));
            }

            if(attackCycle == 640) {
                direction11 = this.Reimu.position.subtract(bull11.position).normalize();
            }
            if(attackCycle <= 640) {
                bull11.position.addInPlace(direction11.scale(accel1));
                accel1 = Math.min(accel1+0.0002, bulletSpeed);
            }
            if(attackCycle == 600) {
                direction12 = this.Reimu.position.subtract(bull12.position).normalize();
            }
            if(attackCycle <= 600) {
                bull12.position.addInPlace(direction12.scale(accel1));
            }
            if(attackCycle == 560) {
                direction13 = this.Reimu.position.subtract(bull13.position).normalize();
            }
            if(attackCycle <= 560) {
                bull13.position.addInPlace(direction13.scale(accel1));
            }
            
            if(attackCycle == 520) {
                direction21 = this.Reimu.position.subtract(bull21.position).normalize();
            }
            if(attackCycle <= 520) {
                bull21.position.addInPlace(direction21.scale(accel2));
                accel2 = Math.min(accel2+0.0002, bulletSpeed);
            }
            if(attackCycle == 480) {
                direction22 = this.Reimu.position.subtract(bull22.position).normalize();
            }
            if(attackCycle <= 480) {
                bull22.position.addInPlace(direction22.scale(accel2));
            }
            
            if(attackCycle == 440) {
                direction31 = this.Reimu.position.subtract(bull31.position).normalize();
            }
            if(attackCycle <= 440) {
                bull31.position.addInPlace(direction31.scale(accel3));
                accel3 = Math.min(accel3+0.0002, bulletSpeed);
            }

            attackCycle-=1;
            /*
            if (meshes[2].intersectsMesh(bull) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull2) && touched == 0) {
                touched = 256;
                bull2.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull3) && touched == 0) {
                touched = 256;
                bull3.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull4) && touched == 0) {
                touched = 256;
                bull4.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull12) && touched == 0) {
                touched = 256;
                bull12.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull13) && touched == 0) {
                touched = 256;
                bull13.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull21) && touched == 0) {
                touched = 256;
                bull21.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull22) && touched == 0) {
                touched = 256;
                bull22.position = new Vector3(14,200,-20);
            } */
        });
    }


    CreateCamera(scene: Scene): void {
        this.camera = new ArcRotateCamera("camera", 0, Math.PI/2, 12, Vector3.Zero(), scene);
        this.camera.attachControl(this.canvas,true);
        this.camera.checkCollisions = true;
        this.camera.angularSensibilityX = 3000;
        this.camera.angularSensibilityY = 3000;
        this.camera.wheelPrecision = 50;
        this.camera.minZ = 0.3;
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 15;
        this.camera.panningSensibility = 0;
    }
}