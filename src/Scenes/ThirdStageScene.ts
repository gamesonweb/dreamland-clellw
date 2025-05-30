import{
    Scene, 
    Engine, 
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    ArcRotateCamera,
    AbstractMesh,
    ActionManager,
    ExecuteCodeAction,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Texture,
    CubeTexture,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui';
import { TransitionCutsceneAyaEnd } from "./TransitionCutsceneAyaEnd";

export class ThirdStageScene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;
    shooting!: number;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageThreeScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }


    /* ************************************************************************* */
    //methods for stage three:

    CreateStageThreeScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,1), scene);
        hemiLight.intensity = 1;

        /*scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };*/

        this.CreateCamera(scene);
        this.camera.position = new Vector3(10,10,0);
        this.CreateStageThreeMap();

        this.CreateReimuStageThree();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:50});
        leftWall.position = new Vector3(30,10,-80);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;

        const rightWall = MeshBuilder.CreateBox("wall", {size:50});
        rightWall.position = new Vector3(30,10,18);
        rightWall.checkCollisions = true;
        rightWall.visibility = 0;

        const backWall = MeshBuilder.CreateBox("wall", {size:50});
        backWall.position = new Vector3(-18,10,-30);
        backWall.checkCollisions = true;
        backWall.visibility = 0;

        const forthWall = MeshBuilder.CreateBox("wall", {size:50});
        forthWall.position = new Vector3(80,10,-30);
        forthWall.checkCollisions = true;
        forthWall.visibility = 0;

        const ceilling = MeshBuilder.CreateBox("wall", {size:50});
        ceilling.position = new Vector3(30,60,-30);
        ceilling.checkCollisions = true;
        ceilling.visibility = 0;

        return scene;
    }

    async CreateStageThreeMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_3.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
        });

        const aya = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "aya.glb"
        );
        aya.meshes[0].scaling.setAll(0.7);
        aya.meshes[0].position = new Vector3(50,5,-31);
        let health = 30;
        const music = await CreateSoundAsync("music",
            "audio/08.YoukaiMountain~MysteriousMountain.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        const needles = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "needles.glb"
        );
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create a health bar container
        const healthBarContainer = new GUI.Rectangle();
        healthBarContainer.width = "170px";
        healthBarContainer.height = "20px";
        healthBarContainer.color = "white";
        healthBarContainer.thickness = 2;
        healthBarContainer.background = "black";
        healthBarContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(healthBarContainer);

        // Create the health bar
        const healthBar = new GUI.Rectangle();
        healthBar.width = "160px";
        healthBar.height = "14px";
        healthBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthBar.background = "orange";
        healthBarContainer.addControl(healthBar);

        // Update health bar width based on health percentage
        function updateHealthBar(health:number) {
            healthBar.width = `${160 * (health / 100)}px`;
        }

        this.scene.onPointerDown = (evt) => {
            if (evt.button === 0 && this.shooting == 0) {
                    this.engine.enterPointerlock();
                    const x = this.Reimu.position._x;
                    const y = this.Reimu.position._y;
                    const z = this.Reimu.position._z;
                    needles.meshes[0].position._x = x-2;
                    needles.meshes[0].position._y = y;
                    needles.meshes[0].position._z = z;
                }
            if (evt.button === 1) this.engine.exitPointerlock();
            };

        needles.meshes[0].scaling.setAll(0.8);
        needles.meshes[0].rotate(Vector3.Up(), Math.PI);
        needles.meshes[0].position = new Vector3(30,200,-20);
    setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            needles.meshes[0].moveWithCollisions(needles.meshes[0].right.scaleInPlace(1.2));
            if (needles.meshes[2].intersectsMesh(aya.meshes[2])) {
                needles.meshes[0].position = new Vector3(30,200,-20);
                health-=1;
                updateHealthBar(health*100/30);
            } 
            map.meshes.forEach((mesh) => {
            if (needles.meshes[2].intersectsMesh(mesh)||needles.meshes[0].position._x>=51) {
                needles.meshes[0].position = new Vector3(30,200,-20);
            } 
        })
            if(health == 0) {
                health--;
                aya.meshes[0].visibility = 0;
                
                const newDiv = document.createElement("div"); 
                const newContent = document.createTextNode("Boss Defeated");
                newDiv.appendChild(newContent);
                newDiv.style.position= 'absolute';
                newDiv.style.top= '60%';
                newDiv.style.left= "50%";
                newDiv.style.transform= "translate(-50%, -0%)";
                newDiv.style.margin= 'auto';
                newDiv.style.background= 'linear-gradient(rgba(255, 255, 255, 0.93), rgba(135, 135, 135, 0.8))';
                newDiv.style.fontSize= '20px';
                newDiv.style.width= '500px';
                newDiv.style.height= '150px';
                newDiv.style.borderRadius= '20px';
                newDiv.style.textAlign= 'center';
                newDiv.style.alignContent= 'center';
                newDiv.style.borderColor= 'red';
                newDiv.style.borderStyle= 'ridge';
                newDiv.style.fontFamily= 'Lucida Console';
                document.body.appendChild(newDiv); 
                setTimeout(()=> {
                    document.body.removeChild(newDiv);
                    music.stop();
                    this.switchTransitionCutsceneAyaEnd();
                }, 3000
                );
            }
    
        });
    }, 2000);
    }

    async CreateReimuStageThree(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(15,5,-31);
        this.Reimu.scaling.setAll(0.6);
        this.Reimu.rotate(Vector3.Up(), Math.PI);
        this.camera.setTarget(meshes[2]);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();

        const flightSpeed = 0.2;
        const soarSpeed = 0.2;
        const focusFlightSpeed = 0.1;
        const rotationSpeed = 0.05;
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
        this.shooting = 0;

        this.scene.onBeforeRenderObservable.add(() => {

            if(touched > 0) {
                    touched-=2;
                    this.shooting = (touched >=10)?1:0;
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
                    acceleration = Math.max(acceleration-0.01, -flightSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                else if(keyStatus.z || keyStatus.q || keyStatus.d) {
                    speed = !keyStatus.Shift ? flightSpeed : focusFlightSpeed;
                    animSpeed = !keyStatus.Shift ? normalAnimSpeed : focusAnimSpeed;
                    flightAnim.speedRatio = animSpeed;
                    acceleration = Math.min(acceleration+0.01, speed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                if(keyStatus.q) {
                    turning = true;
                    rotationAcceleration = Math.max(rotationAcceleration-0.002, -rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                else if(keyStatus.d) {
                    turning = true;
                    rotationAcceleration = Math.min(rotationAcceleration+0.002, rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                if(keyStatus.c) {
                    soaring = true;
                    soarAcceleration = Math.min(soarAcceleration+0.01, soarSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.up.scaleInPlace(soarAcceleration));
                }
                else if(keyStatus.v) {
                    soaring = true;
                    soarAcceleration = Math.max(soarAcceleration-0.01, -soarSpeed);
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
                if(acceleration > 0) acceleration = Math.max(acceleration-0.01, 0);
                else if(acceleration < 0) acceleration = Math.min(acceleration+0.01, 0);
            }
            if(!keyStatus.q && !keyStatus.d) {
                if(rotationAcceleration > 0) rotationAcceleration = Math.max(rotationAcceleration-0.002, 0);
                if(rotationAcceleration < 0) rotationAcceleration = Math.min(rotationAcceleration+0.002, 0);

            }
            if(!keyStatus.c && !keyStatus.v) {
                if(soarAcceleration > 0) soarAcceleration = Math.max(soarAcceleration-0.01, 0);
                if(soarAcceleration < 0) soarAcceleration = Math.min(soarAcceleration+0.01, 0);

            }
        }
        });

        const matR = new StandardMaterial("mat");
        matR.diffuseColor = new Color3(1,0,0);
        const matG = new StandardMaterial("mat");
        matG.diffuseColor = new Color3(0,1,0);
        const matB = new StandardMaterial("mat");
        matB.diffuseColor = new Color3(0,0,1);

        const bull = MeshBuilder.CreateSphere("bull");
        bull.position = new Vector3(40,5,-31);
        (bull as AbstractMesh).material = matR;
        const bull1 = MeshBuilder.CreateSphere("bull");
        bull1.position = new Vector3(41,5,-30);
        bull1.position._x-=0.7;
        bull1.position._z-=0.4;
        (bull1 as AbstractMesh).material = matR;
        const bull2 = MeshBuilder.CreateSphere("bull");
        bull2.position = new Vector3(41,5,-30);
        (bull2 as AbstractMesh).material = matR;
        bull2.position._x-=0.1;
        bull2.position._z-=0.2;
        const bull3 = MeshBuilder.CreateSphere("bull");
        bull3.position = new Vector3(41,5,-30);
        (bull3 as AbstractMesh).material = matR;
        bull3.position._x+=0.5;
        bull3.position._z-=0.4;
        const bull4 = MeshBuilder.CreateSphere("bull");
        bull4.position = new Vector3(42,5,-31);
        bull4.position._x-=0.25;
        (bull4 as AbstractMesh).material = matR;
        const bull5 = MeshBuilder.CreateSphere("bull");
        bull5.position = new Vector3(41,5,-32);
        (bull5 as AbstractMesh).material = matR;
        bull5.position._x+=0.5;
        bull5.position._z+=0.4;
        const bull6 = MeshBuilder.CreateSphere("bull");
        bull6.position = new Vector3(41,5,-32);
        (bull6 as AbstractMesh).material = matR;
        bull6.position._x-=0.1;
        bull6.position._z+=0.2;
        const bull7 = MeshBuilder.CreateSphere("bull");
        bull7.position = new Vector3(41,5,-32);
        bull7.position._x-=0.7;
        bull7.position._z+=0.4;
        (bull7 as AbstractMesh).material = matR;

        const bull20 = MeshBuilder.CreateSphere("bull");
        bull20.position = new Vector3(40,7,-31);
        bull20.position._z-=0.1;
        (bull20 as AbstractMesh).material = matB;
        const bull21 = MeshBuilder.CreateSphere("bull");
        bull21.position = new Vector3(40,7,-31);
        bull21.position._x+=0.3;
        bull21.position._z+=0.6;
        (bull21 as AbstractMesh).material = matB;
        const bull22 = MeshBuilder.CreateSphere("bull");
        bull22.position = new Vector3(41,7,-30);
        bull22.position._x-=0.1;
        bull22.position._z+=0.1;
        (bull22 as AbstractMesh).material = matB;
        const bull23 = MeshBuilder.CreateSphere("bull");
        bull23.position = new Vector3(42,7,-30);
        bull23.position._x-=0.4;
        bull23.position._z+=0.3;
        (bull23 as AbstractMesh).material = matB;
        const bull24 = MeshBuilder.CreateSphere("bull");
        bull24.position = new Vector3(42,7,-30);
        bull24.position._x+=0.3;
        bull24.position._z+=0.1;
        (bull24 as AbstractMesh).material = matB;
        const bull25 = MeshBuilder.CreateSphere("bull");
        bull25.position = new Vector3(43,7,-31);
        bull25.position._x-=0.1;
        bull25.position._z+=0.6;
        (bull25 as AbstractMesh).material = matB;
        const bull26 = MeshBuilder.CreateSphere("bull");
        bull26.position = new Vector3(43,7,-31);
        bull26.position._x+=0.2;
        bull26.position._z-=0.1;
        (bull26 as AbstractMesh).material = matB;
        const bull27 = MeshBuilder.CreateSphere("bull");
        bull27.position = new Vector3(43,7,-32);
        bull27.position._x-=0.1;
        bull27.position._z+=0.2;
        (bull27 as AbstractMesh).material = matB;
        const bull28 = MeshBuilder.CreateSphere("bull");
        bull28.position = new Vector3(42,7,-32);
        bull28.position._x+=0.3;
        bull28.position._z-=0.3;
        (bull28 as AbstractMesh).material = matB;
        const bull29 = MeshBuilder.CreateSphere("bull");
        bull29.position = new Vector3(42,7,-32);
        bull29.position._x-=0.4;
        bull29.position._z-=0.5;
        (bull29 as AbstractMesh).material = matB;
        const bull210 = MeshBuilder.CreateSphere("bull");
        bull210.position = new Vector3(41,7,-32);
        bull210.position._x-=0.1;
        bull210.position._z-=0.3;
        (bull210 as AbstractMesh).material = matB;
        const bull211 = MeshBuilder.CreateSphere("bull");
        bull211.position = new Vector3(40,7,-31);
        bull211.position._x+=0.3;
        bull211.position._z-=0.8;
        (bull211 as AbstractMesh).material = matB;

        
        const bull30 = MeshBuilder.CreateSphere("bull");
        bull30.position = new Vector3(40,9,-31);
        (bull30 as AbstractMesh).material = matG;
        const bull31 = MeshBuilder.CreateSphere("bull");
        bull31.position = new Vector3(41,9,-28);
        (bull31 as AbstractMesh).material = matG;
        const bull32 = MeshBuilder.CreateSphere("bull");
        bull32.position = new Vector3(43,9,-26);
        (bull32 as AbstractMesh).material = matG;
        const bull33 = MeshBuilder.CreateSphere("bull");
        bull33.position = new Vector3(46,9,-25);
        (bull33 as AbstractMesh).material = matG;
        const bull34 = MeshBuilder.CreateSphere("bull");
        bull34.position = new Vector3(49,9,-26);
        (bull34 as AbstractMesh).material = matG;
        const bull35 = MeshBuilder.CreateSphere("bull");
        bull35.position = new Vector3(51,9,-28);
        (bull35 as AbstractMesh).material = matG;
        const bull36 = MeshBuilder.CreateSphere("bull");
        bull36.position = new Vector3(52,9,-31);
        (bull36 as AbstractMesh).material = matG;
        const bull37 = MeshBuilder.CreateSphere("bull");
        bull37.position = new Vector3(51,9,-34);
        (bull37 as AbstractMesh).material = matG;
        const bull38 = MeshBuilder.CreateSphere("bull");
        bull38.position = new Vector3(49,9,-36);
        (bull38 as AbstractMesh).material = matG;
        const bull39 = MeshBuilder.CreateSphere("bull");
        bull39.position = new Vector3(46,9,-37);
        (bull39 as AbstractMesh).material = matG;
        const bull310 = MeshBuilder.CreateSphere("bull");
        bull310.position = new Vector3(43,9,-36);
        (bull310 as AbstractMesh).material = matG;
        const bull311 = MeshBuilder.CreateSphere("bull");
        bull311.position = new Vector3(41,9,-34);
        (bull311 as AbstractMesh).material = matG;

        
        let Rcycle = 298;
        let Gcycle = 998;
        let Bcycle = 698;
        const Rspeed = 0.4;
        const Gspeed = 0.1;
        const Bspeed = 0.22;
        let Rdirection = this.Reimu.position.subtract(bull.position).normalize();
        let Gdirection = this.Reimu.position.subtract(bull.position).normalize();
        let Bdirection = this.Reimu.position.subtract(bull.position).normalize();
        setTimeout(() => {
        this.scene.onBeforeRenderObservable.add(() => {
            if(Rcycle == 0) {
                Rcycle = 300;
                bull.position = new Vector3(40,5,-31);
                bull1.position = new Vector3(41,5,-30);
                bull1.position._x-=0.7;
                bull1.position._z-=0.4;
                bull2.position = new Vector3(41,5,-30);
                bull2.position._x-=0.1;
                bull2.position._z-=0.2;
                bull3.position = new Vector3(41,5,-30);
                bull3.position._x+=0.5;
                bull3.position._z-=0.4;
                bull4.position = new Vector3(42,5,-31);
                bull4.position._x-=0.25;
                bull5.position = new Vector3(41,5,-32);
                bull5.position._x+=0.5;
                bull5.position._z+=0.4;
                bull6.position = new Vector3(41,5,-32);
                bull6.position._x-=0.1;
                bull6.position._z+=0.2;
                bull7.position = new Vector3(41,5,-32);
                bull7.position._x-=0.7;
                bull7.position._z+=0.4;
                Rdirection = this.Reimu.position.subtract(bull.position).normalize();
            }
            bull.position.addInPlace(Rdirection.scale(Rspeed));
            bull1.position.addInPlace(Rdirection.scale(Rspeed));
            bull2.position.addInPlace(Rdirection.scale(Rspeed));
            bull3.position.addInPlace(Rdirection.scale(Rspeed));
            bull4.position.addInPlace(Rdirection.scale(Rspeed));
            bull5.position.addInPlace(Rdirection.scale(Rspeed));
            bull6.position.addInPlace(Rdirection.scale(Rspeed));
            bull7.position.addInPlace(Rdirection.scale(Rspeed));

            if(Bcycle == 0) {
                Bcycle = 700; 
                bull20.position = new Vector3(40,7,-31);
                bull20.position._z-=0.1;
                bull21.position = new Vector3(40,7,-31);
                bull21.position._x+=0.3;
                bull21.position._z+=0.6;
                bull22.position = new Vector3(41,7,-30);
                bull22.position._x-=0.1;
                bull22.position._z+=0.1;
                bull23.position = new Vector3(42,7,-30);
                bull23.position._x-=0.4;
                bull23.position._z+=0.3;
                bull24.position = new Vector3(42,7,-30);
                bull24.position._x+=0.3;
                bull24.position._z+=0.1;
                bull25.position = new Vector3(43,7,-31);
                bull25.position._x-=0.1;
                bull25.position._z+=0.6;
                bull26.position = new Vector3(43,7,-31);
                bull26.position._x+=0.2;
                bull26.position._z-=0.1;
                bull27.position = new Vector3(43,7,-32);
                bull27.position._x-=0.1;
                bull27.position._z+=0.2;
                bull28.position = new Vector3(42,7,-32);
                bull28.position._x+=0.3;
                bull28.position._z-=0.3;
                bull29.position = new Vector3(42,7,-32);
                bull29.position._x-=0.4;
                bull29.position._z-=0.5;
                bull210.position = new Vector3(41,7,-32);
                bull210.position._x-=0.1;
                bull210.position._z-=0.3;
                bull211.position = new Vector3(40,7,-31);
                bull211.position._x+=0.3;
                bull211.position._z-=0.8;
                Bdirection = this.Reimu.position.subtract(bull20.position).normalize();
            }
            bull20.position.addInPlace(Bdirection.scale(Bspeed));
            bull21.position.addInPlace(Bdirection.scale(Bspeed));
            bull22.position.addInPlace(Bdirection.scale(Bspeed));
            bull23.position.addInPlace(Bdirection.scale(Bspeed));
            bull24.position.addInPlace(Bdirection.scale(Bspeed));
            bull25.position.addInPlace(Bdirection.scale(Bspeed));
            bull26.position.addInPlace(Bdirection.scale(Bspeed));
            bull27.position.addInPlace(Bdirection.scale(Bspeed));
            bull28.position.addInPlace(Bdirection.scale(Bspeed));
            bull29.position.addInPlace(Bdirection.scale(Bspeed));
            bull210.position.addInPlace(Bdirection.scale(Bspeed));
            bull211.position.addInPlace(Bdirection.scale(Bspeed));

            if(Gcycle == 0) {
                Gcycle = 1000;
                bull30.position = new Vector3(40,9,-31);
                bull31.position = new Vector3(41,9,-28);
                bull32.position = new Vector3(43,9,-26);
                bull33.position = new Vector3(46,9,-25);
                bull34.position = new Vector3(49,9,-26);
                bull35.position = new Vector3(51,9,-28);
                bull36.position = new Vector3(52,9,-31);
                bull37.position = new Vector3(51,9,-34);
                bull38.position = new Vector3(49,9,-36);
                bull39.position = new Vector3(46,9,-37);
                bull310.position = new Vector3(43,9,-36);
                bull311.position = new Vector3(41,9,-34);
                Gdirection = this.Reimu.position.subtract(bull30.position).normalize();
            }
            bull30.position.addInPlace(Gdirection.scale(Gspeed));
            bull31.position.addInPlace(Gdirection.scale(Gspeed));
            bull32.position.addInPlace(Gdirection.scale(Gspeed));
            bull33.position.addInPlace(Gdirection.scale(Gspeed));
            bull34.position.addInPlace(Gdirection.scale(Gspeed));
            bull35.position.addInPlace(Gdirection.scale(Gspeed));
            bull36.position.addInPlace(Gdirection.scale(Gspeed));
            bull37.position.addInPlace(Gdirection.scale(Gspeed));
            bull38.position.addInPlace(Gdirection.scale(Gspeed));
            bull39.position.addInPlace(Gdirection.scale(Gspeed));
            bull310.position.addInPlace(Gdirection.scale(Gspeed));
            bull311.position.addInPlace(Gdirection.scale(Gspeed));

            Rcycle-=2;
            Bcycle-=2;
            Gcycle-=2;

            if (meshes[2].intersectsMesh(bull) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull1) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull2) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull3) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull4) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull5) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull6) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull7) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull20) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull21) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull22) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull23) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull24) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull25) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull26) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull27) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull28) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull29) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull210) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull211) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull30) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull31) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull32) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull33) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull34) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull35) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull36) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull37) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull38) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull39) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull310) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull311) && touched == 0) {
                touched = 256;
                bull.position = new Vector3(14,200,-20);
            } 
        })
    }, 2000);
    }

    CreateSkybox(): void{
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox_d", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }

    switchTransitionCutsceneAyaEnd() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new TransitionCutsceneAyaEnd(this.canvas).scene;
        this.scene = next;
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