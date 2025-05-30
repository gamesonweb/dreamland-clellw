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
import { TransitionCutsceneNazrinEnd } from "./TransitionCutsceneNazrinEnd";

export class SecondStageScene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;
    shooting!: number;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageTwoScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }

    /* ************************************************************************* */
    //methods for stage two:

    CreateStageTwoScene(): Scene {
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
        this.CreateStageTwoMap();

        this.CreateReimuStageTwo();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:50});
        leftWall.position = new Vector3(-40,0,-70);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;

        const rightWall = MeshBuilder.CreateBox("wall", {size:50});
        rightWall.position = new Vector3(-40,0,10);
        rightWall.checkCollisions = true;
        rightWall.visibility = 0;

        const backWall = MeshBuilder.CreateBox("wall", {size:50});
        backWall.position = new Vector3(-65,0,-35);
        backWall.checkCollisions = true;
        backWall.visibility = 0;

        const forthWall = MeshBuilder.CreateBox("wall", {size:50});
        forthWall.position = new Vector3(5,0,-35);
        forthWall.checkCollisions = true;
        forthWall.visibility = 0;

        const ceilling = MeshBuilder.CreateBox("wall", {size:50});
        ceilling.position = new Vector3(-40,45,-35);
        ceilling.checkCollisions = true;
        ceilling.visibility = 0;
        return scene;

    }
    
    async CreateStageTwoMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_2.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
        });

        const nazrin = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "nazrin.glb"
        );
        nazrin.meshes[0].scaling.setAll(0.2);
        nazrin.meshes[0].position = new Vector3(-37,5,-33);
        nazrin.meshes[0].rotate(Vector3.Up(), 3.1);
        let health = 30;
        const music = await CreateSoundAsync("music",
            "audio/06.AttheHarborofSpring.mp3",
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
        healthBar.background = "grey";
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

        needles.meshes[0].scaling.setAll(0.5);
        needles.meshes[0].position = new Vector3(30,200,-20);
    setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            needles.meshes[0].moveWithCollisions(needles.meshes[0].right.scaleInPlace(0.6));
            if (needles.meshes[2].intersectsMesh(nazrin.meshes[2])) {
                needles.meshes[0].position = new Vector3(30,200,-20);
                health-=1;
                updateHealthBar(health*100/30);
            } 
            map.meshes.forEach((mesh) => {
            if (needles.meshes[2].intersectsMesh(mesh)||needles.meshes[0].position._x<=-38) {
                needles.meshes[0].position = new Vector3(30,200,-20);
            } 
        })
            if(health == 0) {
                health--;
                nazrin.meshes[0].visibility = 0;
                
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
                    this.switchTransitionCutsceneNazrinEnd();
                }, 3000
                );
            }
    
        });
    }, 2000);
    }

    async CreateReimuStageTwo(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(-25,5,-33);
        this.Reimu.scaling.setAll(0.2); // Scales the mesh to half its original size
        this.camera.setTarget(meshes[2]);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();

        const flightSpeed = 0.1;
        const soarSpeed = 0.1;
        const focusFlightSpeed = 0.05;
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
                    acceleration = Math.max(acceleration-0.005, -flightSpeed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                else if(keyStatus.z || keyStatus.q || keyStatus.d) {
                    speed = !keyStatus.Shift ? flightSpeed : focusFlightSpeed;
                    animSpeed = !keyStatus.Shift ? normalAnimSpeed : focusAnimSpeed;
                    flightAnim.speedRatio = animSpeed;
                    acceleration = Math.min(acceleration+0.005, speed);
                    this.Reimu.moveWithCollisions(this.Reimu.right.scaleInPlace(acceleration));
                }
                if(keyStatus.q) {
                    turning = true;
                    rotationAcceleration = Math.max(rotationAcceleration-0.001, -rotationSpeed);
                    this.Reimu.rotate(Vector3.Up(), rotationAcceleration);
                }
                else if(keyStatus.d) {
                    turning = true;
                    rotationAcceleration = Math.min(rotationAcceleration+0.001, rotationSpeed);
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
                if(rotationAcceleration > 0) rotationAcceleration = Math.max(rotationAcceleration-0.001, 0);
                if(rotationAcceleration < 0) rotationAcceleration = Math.min(rotationAcceleration+0.001, 0);

            }
            if(!keyStatus.c && !keyStatus.v) {
                if(soarAcceleration > 0) soarAcceleration = Math.max(soarAcceleration-0.005, 0);
                if(soarAcceleration < 0) soarAcceleration = Math.min(soarAcceleration+0.005, 0);

            }
        }
        });

        //creating the bullets of the boss
        
        this.Reimu.checkCollisions = true;

        const mat = new StandardMaterial("mat");
        mat.diffuseColor = new Color3(1,0.9,0.9);
        const bull = MeshBuilder.CreateSphere("bull");
        bull.position = new Vector3(14,200,-20);
        (bull as AbstractMesh).material = mat;
        const bull2 = MeshBuilder.CreateSphere("bull");
        bull2.position = new Vector3(14,200,-20);
        (bull2 as AbstractMesh).material = mat;
        const bull3 = MeshBuilder.CreateSphere("bull");
        bull3.position = new Vector3(14,200,-20);
        (bull3 as AbstractMesh).material = mat;
        const bull4 = MeshBuilder.CreateSphere("bull");
        bull4.position = new Vector3(14,200,-20);
        (bull4 as AbstractMesh).material = mat;
        const bull5 = MeshBuilder.CreateSphere("bull");
        bull5.position = new Vector3(14,200,-20);
        (bull5 as AbstractMesh).material = mat;

        const bull10 = MeshBuilder.CreateSphere("bull");
        bull10.position = new Vector3(14,200,-20);
        (bull10 as AbstractMesh).material = mat;
        const bull12 = MeshBuilder.CreateSphere("bull");
        bull12.position = new Vector3(14,200,-20);
        (bull12 as AbstractMesh).material = mat;
        const bull13 = MeshBuilder.CreateSphere("bull");
        bull13.position = new Vector3(14,200,-20);
        (bull13 as AbstractMesh).material = mat;
        const bull14 = MeshBuilder.CreateSphere("bull");
        bull14.position = new Vector3(14,200,-20);
        (bull14 as AbstractMesh).material = mat;
        const bull15 = MeshBuilder.CreateSphere("bull");
        bull15.position = new Vector3(14,200,-20);
        (bull15 as AbstractMesh).material = mat;

        const bull20 = MeshBuilder.CreateSphere("bull");
        bull20.position = new Vector3(14,200,-20);
        (bull20 as AbstractMesh).material = mat;
        const bull22 = MeshBuilder.CreateSphere("bull");
        bull22.position = new Vector3(14,200,-20);
        (bull22 as AbstractMesh).material = mat;
        const bull23 = MeshBuilder.CreateSphere("bull");
        bull23.position = new Vector3(14,200,-20);
        (bull23 as AbstractMesh).material = mat;
        const bull24 = MeshBuilder.CreateSphere("bull");
        bull24.position = new Vector3(14,200,-20);
        (bull24 as AbstractMesh).material = mat;
        const bull25 = MeshBuilder.CreateSphere("bull");
        bull25.position = new Vector3(14,200,-20);
        (bull25 as AbstractMesh).material = mat;

        let attackCycle = 298;
        const bulletSpeed = 0.17;
        let direction = this.Reimu.position.subtract(bull.position).normalize();
        let direction2 = this.Reimu.position.subtract(bull.position).normalize();
        let direction3 = this.Reimu.position.subtract(bull.position).normalize();
        
        //checking collisions between player and bullets

    setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            if(attackCycle == 0) {
                bull.position = new Vector3(-35,5,-33);
                bull2.position = new Vector3(-35,5,-30);
                bull3.position = new Vector3(-35,5,-28);
                bull4.position = new Vector3(-35,5,-35);
                bull5.position = new Vector3(-35,5,-38);
                direction = this.Reimu.position.subtract(bull.position).normalize();
                attackCycle = 400;
            }
            bull.position.addInPlace(direction.scale(bulletSpeed));
            bull2.position.addInPlace(direction.scale(bulletSpeed));
            bull3.position.addInPlace(direction.scale(bulletSpeed));
            bull4.position.addInPlace(direction.scale(bulletSpeed));
            bull5.position.addInPlace(direction.scale(bulletSpeed));
            
            if(attackCycle == 350) {
                bull10.position = new Vector3(-35,7,-33);
                bull12.position = new Vector3(-35,7,-31);
                bull13.position = new Vector3(-35,6,-29);
                bull14.position = new Vector3(-35,6,-35);
                bull15.position = new Vector3(-35,7,-36);
                direction2 = this.Reimu.position.subtract(bull10.position).normalize();
            }
            bull10.position.addInPlace(direction2.scale(bulletSpeed));
            bull12.position.addInPlace(direction2.scale(bulletSpeed));
            bull13.position.addInPlace(direction2.scale(bulletSpeed));
            bull14.position.addInPlace(direction2.scale(bulletSpeed));
            bull15.position.addInPlace(direction2.scale(bulletSpeed));

            if(attackCycle == 300) {
                bull20.position = new Vector3(-35,4,-33);
                bull22.position = new Vector3(-35,3,-30);
                bull23.position = new Vector3(-35,4,-28);
                bull24.position = new Vector3(-35,4,-35);
                bull25.position = new Vector3(-35,3,-38);
                direction3 = this.Reimu.position.subtract(bull20.position).normalize();
            }
            bull20.position.addInPlace(direction3.scale(bulletSpeed));
            bull22.position.addInPlace(direction3.scale(bulletSpeed));
            bull23.position.addInPlace(direction3.scale(bulletSpeed));
            bull24.position.addInPlace(direction3.scale(bulletSpeed));
            bull25.position.addInPlace(direction3.scale(bulletSpeed));

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
            if (meshes[2].intersectsMesh(bull10) && touched == 0) {
                touched = 256;
                bull10.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull12) && touched == 0) {
                touched = 256;
                bull12.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull13) && touched == 0) {
                touched = 256;
                bull13.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull14) && touched == 0) {
                touched = 256;
                bull14.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull15) && touched == 0) {
                touched = 256;
                bull15.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull20) && touched == 0) {
                touched = 256;
                bull20.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull22) && touched == 0) {
                touched = 256;
                bull22.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull23) && touched == 0) {
                touched = 256;
                bull23.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull24) && touched == 0) {
                touched = 256;
                bull24.position = new Vector3(14,200,-20);
            } 
            if (meshes[2].intersectsMesh(bull25) && touched == 0) {
                touched = 256;
                bull25.position = new Vector3(14,200,-20);
            } 
        });
    },500);
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

    switchTransitionCutsceneNazrinEnd() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new TransitionCutsceneNazrinEnd(this.canvas).scene;
        this.scene = next;
    }
}