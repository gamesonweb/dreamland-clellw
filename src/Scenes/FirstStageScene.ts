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
    CubeTexture,
    Texture,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui';
import { TransitionCutsceneCirnoEnd } from "./TransitionCutsceneCirnoEnd";

export class FirstStageScene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;
    shooting!: number;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageOneScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }


    /* ************************************************************************* */
    //methods for stage one:


    CreateStageOneScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
        hemiLight.intensity = 1;

        /*scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
          };*/
        
        scene.collisionsEnabled = true;
        
        this.CreateCamera(scene);
        this.camera.position = new Vector3(10,10,0);

        this.CreateReimuStageOne();

        this.CreateStageOneMap();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:40});
        leftWall.position = new Vector3(20,10,-60);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;

        const rightWall = MeshBuilder.CreateBox("wall", {size:40});
        rightWall.position = new Vector3(20,10,20);
        rightWall.checkCollisions = true;
        rightWall.visibility = 0;

        const forthWall = MeshBuilder.CreateBox("wall", {size:40});
        forthWall.position = new Vector3(60,10,-20);
        forthWall.checkCollisions = true;
        forthWall.visibility = 0;
        
        const backWall = MeshBuilder.CreateBox("wall", {size:40});
        backWall.position = new Vector3(-20,10,-20);
        backWall.checkCollisions = true;
        backWall.visibility = 0;

        const ceilling = MeshBuilder.CreateBox("wall", {size:40});
        ceilling.position = new Vector3(20,50,-20);
        ceilling.checkCollisions = true;
        ceilling.visibility = 0;
        scene.audioEnabled = true;
        return scene;

    }

    async CreateStageOneMap(): Promise<void> {

        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_1.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
        });

        const cirno = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "cirno.glb"
        );
        cirno.meshes[0].scaling.setAll(0.4);
        cirno.meshes[0].position = new Vector3(12,20,-20);
        cirno.meshes[0].rotate(Vector3.Up(), 3.1);
        cirno.meshes[2].checkCollisions = true;
        let health = 20;
        const music = await CreateSoundAsync("music",
            "audio/04.TomboyishGirlinLove.mp3",
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
        healthBarContainer.width = "150px";
        healthBarContainer.height = "20px";
        healthBarContainer.color = "white";
        healthBarContainer.thickness = 2;
        healthBarContainer.background = "black";
        healthBarContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(healthBarContainer);

        // Create the health bar
        const healthBar = new GUI.Rectangle();
        healthBar.width = "140px";
        healthBar.height = "14px";
        healthBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthBar.background = "cyan";
        healthBarContainer.addControl(healthBar);

        // Update health bar width based on health percentage
        function updateHealthBar(health:number) {
            healthBar.width = `${140 * (health / 100)}px`;
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
        needles.meshes[0].position = new Vector3(30,200,-20);
    setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            needles.meshes[0].moveWithCollisions(needles.meshes[0].right.scaleInPlace(0.6));
            if (needles.meshes[2].intersectsMesh(cirno.meshes[2])) {
                needles.meshes[0].position = new Vector3(30,200,-20);
                health-=1;
                updateHealthBar(health*100/20);
            } 
            map.meshes.forEach((mesh) => {
            if (needles.meshes[2].intersectsMesh(mesh)||needles.meshes[0].position._x<=10) {
                needles.meshes[0].position = new Vector3(30,200,-20);
            } 
        })
            if(health == 0) {
                health--;
                cirno.meshes[0].visibility = 0;
                
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
                    this.switchTransitionCutsceneCirnoEnd();
                }, 3000
                );
            }
    
        });
    }, 2000);
    }

    async CreateReimuStageOne(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(35,11,-21);
        this.Reimu.scaling.setAll(0.4); // Scales the mesh to half its original size
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
        //creating the bullets of the boss

        this.Reimu.checkCollisions = true;
        
        const bull = MeshBuilder.CreateSphere("bull");
        bull.position = new Vector3(14,200,-20);
        const bull2 = MeshBuilder.CreateSphere("bull");
        bull2.position = new Vector3(14,200,-20);
        const bull3 = MeshBuilder.CreateSphere("bull");
        bull3.position = new Vector3(14,200,-20);
        const bull4 = MeshBuilder.CreateSphere("bull");
        bull4.position = new Vector3(14,200,-20);
        const bull5 = MeshBuilder.CreateSphere("bull");
        bull5.position = new Vector3(14,200,-20);

        let attackCycle = 0;
        let direction = this.Reimu.position.subtract(bull.position).normalize();
        let direction2 = this.Reimu.position.subtract(bull2.position).normalize();
        let direction3 = this.Reimu.position.subtract(bull3.position).normalize();
        let direction4 = this.Reimu.position.subtract(bull4.position).normalize();
        let direction5 = this.Reimu.position.subtract(bull5.position).normalize();
        
        //checking collisions between player and bullets

    setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            if(attackCycle == 0) {
                bull.position = new Vector3(14,20,-20)
                direction = this.Reimu.position.subtract(bull.position).normalize();
                attackCycle = 600;
            }
            bull.position.addInPlace(direction.scale(0.14));
            if(attackCycle == 576) {
                bull2.position = new Vector3(14,20,-20)
                direction2 = this.Reimu.position.subtract(bull2.position).normalize();
            }
            bull2.position.addInPlace(direction2.scale(0.14));
            if(attackCycle == 550) {
                bull3.position = new Vector3(14,20,-20)
                direction3 = this.Reimu.position.subtract(bull3.position).normalize();
            }
            bull3.position.addInPlace(direction3.scale(0.14));
            if(attackCycle == 526) {
                bull4.position = new Vector3(14,20,-20)
                direction4 = this.Reimu.position.subtract(bull4.position).normalize();
            }
            bull4.position.addInPlace(direction4.scale(0.14));
            if(attackCycle == 500) {
                bull5.position = new Vector3(14,20,-20)
                direction5 = this.Reimu.position.subtract(bull5.position).normalize();
            }
            bull5.position.addInPlace(direction5.scale(0.14));
            attackCycle-=2;
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
            if (meshes[2].intersectsMesh(bull5) && touched == 0) {
                touched = 256;
                bull5.position = new Vector3(14,200,-20);
            }
        });
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
    
    switchTransitionCutsceneCirnoEnd() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new TransitionCutsceneCirnoEnd(this.canvas).scene;
        this.scene = next;
    }

}