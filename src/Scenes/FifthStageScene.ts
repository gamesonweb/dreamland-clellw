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
    Vector2,
    Texture,
    CubeTexture,
    CreateSoundAsync,
} from "@babylonjs/core";
import { FireProceduralTexture } from "@babylonjs/procedural-textures";
import * as GUI from '@babylonjs/gui'
import "@babylonjs/loaders";
import { EndingScene } from "./EndingScene";

export class FifthStageScene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;
    shooting!: number;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageFiveScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }


    /* ************************************************************************* */
        //methods for stage five: 
    
        CreateStageFiveScene(): Scene {
            this.engine.stopRenderLoop();
            const scene = new Scene(this.engine);
            const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
            hemiLight.intensity = 1;
    
            /*scene.onPointerDown = (evt) => {
                if (evt.button === 0) this.engine.enterPointerlock();
                if (evt.button === 1) this.engine.exitPointerlock();
            };*/
            
            this.CreateCamera(scene);
            this.camera.position = new Vector3(10,10,0); 
    
            const ground = MeshBuilder.CreateGround("ground");
            ground.scaling = new Vector3(50,50,50);
            ground.checkCollisions = true;
    
            const texture = new FireProceduralTexture('texture', 256, scene);
            const mat = new StandardMaterial('mat', scene);
            mat.diffuseTexture = texture;
            ground.material = mat;
            texture.speed = new Vector2(0.1,0.1)
            texture.fireColors = [
                new Color3(0,0,1),
                new Color3(0,1,1),
                new Color3(0,1,0),
                new Color3(0,1,1),
                new Color3(1,0,0),
                new Color3(1,1,0)
            ]
    
            
            
            const leftWall = MeshBuilder.CreateBox("wall", {size:60});
            leftWall.position = new Vector3(0,10,-55);
            leftWall.checkCollisions = true;
            leftWall.visibility = 0;
    
            const rightWall = MeshBuilder.CreateBox("wall", {size:60});
            rightWall.position = new Vector3(0,10,55);
            rightWall.checkCollisions = true;
            rightWall.visibility = 0;
    
            const backWall = MeshBuilder.CreateBox("wall", {size:60});
            backWall.position = new Vector3(-55,10,0);
            backWall.checkCollisions = true;
            backWall.visibility = 0;
    
            const forthWall = MeshBuilder.CreateBox("wall", {size:60});
            forthWall.position = new Vector3(55,10,0);
            forthWall.checkCollisions = true;
            forthWall.visibility = 0;
    
            const ceilling = MeshBuilder.CreateBox("wall", {size:60});
            ceilling.position = new Vector3(0,60,0);
            ceilling.checkCollisions = true;
            ceilling.visibility = 0;
    
            this.CreateStageFiveReimu();
            this.CreateStageFiveMap();
            return scene;
        }
    
    
        async CreateStageFiveMap(): Promise<void> {
    
            const sumireko = await SceneLoader.ImportMeshAsync(
                "",
                "./models/",
                "sumireko.glb"
            );
            sumireko.meshes[0].scaling.setAll(0.5);
            sumireko.meshes[0].position = new Vector3(-10,7,0);
            sumireko.meshes[0].rotate(Vector3.Up(), 3.1);
        let health = 55;
        const music = await CreateSoundAsync("music",
            "audio/14.LastOccultism~EsotericistofthePresentWorld.mp3",
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
        healthBarContainer.width = "250px";
        healthBarContainer.height = "20px";
        healthBarContainer.color = "white";
        healthBarContainer.thickness = 2;
        healthBarContainer.background = "black";
        healthBarContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(healthBarContainer);

        // Create the health bar
        const healthBar = new GUI.Rectangle();
        healthBar.width = "240px";
        healthBar.height = "14px";
        healthBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthBar.background = "purple";
        healthBarContainer.addControl(healthBar);

        // Update health bar width based on health percentage
        function updateHealthBar(health:number) {
            healthBar.width = `${240 * (health / 100)}px`;
        }
        this.scene.onPointerDown = (evt) => {
            if (evt.button === 0 && this.shooting == 0) {
                    this.engine.enterPointerlock();
                    const x = this.Reimu.position._x;
                    const y = this.Reimu.position._y;
                    const z = this.Reimu.position._z;
                    needles.meshes[0].position._x = x;
                    needles.meshes[0].position._y = y;
                    needles.meshes[0].position._z = z;
                }
            if (evt.button === 1) this.engine.exitPointerlock();
            };

        needles.meshes[0].scaling.setAll(1);
        needles.meshes[0].position = new Vector3(30,200,-20);
setTimeout(() =>{
        this.scene.onBeforeRenderObservable.add(() => {
            needles.meshes[0].moveWithCollisions(needles.meshes[0].right.scaleInPlace(0.7));
            if (needles.meshes[2].intersectsMesh(sumireko.meshes[2])) {
                needles.meshes[0].position = new Vector3(30,200,-20);
                health-=1;
                updateHealthBar(health*100/55);
            } 
            if (needles.meshes[0].position._x<=-14) {
                needles.meshes[0].position = new Vector3(30,200,-20);
            } 
            if(health == 0) {
                health--;
                sumireko.meshes[0].visibility = 0;
                
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
                    this.switchToEndingScene();
                }, 3000
                );
            }
    
        });
    }, 2000);
        }
    
    
        async CreateStageFiveReimu(): Promise<void> {
            const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
                "",
                "./models/",
                "Reimu_animated.glb"
              );
            this.Reimu = meshes[0];
            this.Reimu.position = new Vector3(12,3,0);
            this.Reimu.position._z -= 0.5;
            this.Reimu.scaling.setAll(0.4);
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
    
            const Rmat = new StandardMaterial("mat");
            Rmat.diffuseColor = new Color3(1,0,0);
            const Bmat = new StandardMaterial("mat");
            Bmat.diffuseColor = new Color3(0,0,1);
            const Pmat = new StandardMaterial("mat");
            Pmat.diffuseColor = new Color3(1,0,1);
    
            const bullR = MeshBuilder.CreateSphere("bull");
            bullR.position = new Vector3(-10,8,3);
            (bullR as AbstractMesh).material = Rmat;
            const bullB = MeshBuilder.CreateSphere("bull");
            bullB.position = new Vector3(-10,8,-3);
            bullB.position._z -= 0.5;
            (bullB as AbstractMesh).material = Bmat;
    
            const bull = MeshBuilder.CreateSphere("bull");
            bull.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull as AbstractMesh).material = Pmat;
            const bull1 = MeshBuilder.CreateSphere("bull");
            bull1.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull1 as AbstractMesh).material = Pmat;
            const bull2 = MeshBuilder.CreateSphere("bull");
            bull2.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull2 as AbstractMesh).material = Pmat;
            const bull3 = MeshBuilder.CreateSphere("bull");
            bull3.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull3 as AbstractMesh).material = Pmat;
            const bull4 = MeshBuilder.CreateSphere("bull");
            bull4.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull4 as AbstractMesh).material = Pmat;
            const bull5 = MeshBuilder.CreateSphere("bull");
            bull5.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull5 as AbstractMesh).material = Pmat;
            const bull6 = MeshBuilder.CreateSphere("bull");
            bull6.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull6 as AbstractMesh).material = Pmat;
            const bull7 = MeshBuilder.CreateSphere("bull");
            bull7.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull7 as AbstractMesh).material = Pmat;
            const bull8 = MeshBuilder.CreateSphere("bull");
            bull8.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull8 as AbstractMesh).material = Pmat;
            const bull9 = MeshBuilder.CreateSphere("bull");
            bull9.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull9 as AbstractMesh).material = Pmat;
            const bull10 = MeshBuilder.CreateSphere("bull");
            bull10.position = new Vector3(Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3);
            (bull10 as AbstractMesh).material = Pmat;
    
            let directionR = this.Reimu.position.subtract(bullR.position).normalize();
            let directionB = this.Reimu.position.subtract(bullB.position).normalize();
    
            let accelR = 0.05;
            let modR = 0.0005;
            const speedB = 0.05;
            const speedP = 0.08;
            const boss = MeshBuilder.CreateSphere('boss');
            boss.position = new Vector3(-10,8,0);
            boss.position._z -= 0.5;
            boss.visibility = 0;
            const drag = 0.01;
            
            let directionP = boss.position.subtract(this.Reimu.position).normalize();
            let direction = boss.position.subtract(bull.position).normalize();
            let direction1 = boss.position.subtract(bull1.position).normalize();
            let direction2 = boss.position.subtract(bull2.position).normalize();
            let direction3 = boss.position.subtract(bull3.position).normalize();
            let direction4 = boss.position.subtract(bull4.position).normalize();
            let direction5 = boss.position.subtract(bull5.position).normalize();
            let direction6 = boss.position.subtract(bull6.position).normalize();
            let direction7 = boss.position.subtract(bull7.position).normalize();
            let direction8 = boss.position.subtract(bull8.position).normalize();
            let direction9 = boss.position.subtract(bull9.position).normalize();
            let direction10 = boss.position.subtract(bull10.position).normalize();
    setTimeout(() => {
            this.scene.onBeforeRenderObservable.add(() => {
                directionP = boss.position.subtract(this.Reimu.position).normalize();
                directionR = this.Reimu.position.subtract(bullR.position).normalize();
                directionB = this.Reimu.position.subtract(bullB.position).normalize();
                if(Math.abs(accelR) >= 0.10) {
                    modR *= -1;
                }
                accelR += modR;
                if(touched == 0) {
                    bullR.position.addInPlace(directionR.scale(Math.abs(accelR)));
                    bullB.position.addInPlace(directionB.scale(speedB));
                }
    
                if(bull.intersectsMesh(boss)) {
                    bull.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction = boss.position.subtract(bull.position).normalize();
                }
                if(bull1.intersectsMesh(boss)) {
                    bull1.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction1 = boss.position.subtract(bull1.position).normalize();
                }
                if(bull2.intersectsMesh(boss)) {
                    bull2.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction2 = boss.position.subtract(bull2.position).normalize();
                }
                if(bull3.intersectsMesh(boss)) {
                    bull3.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction3 = boss.position.subtract(bull3.position).normalize();
                }
                if(bull4.intersectsMesh(boss)) {
                    bull4.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction4 = boss.position.subtract(bull4.position).normalize();
                }
                if(bull5.intersectsMesh(boss)) {
                    bull5.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction5 = boss.position.subtract(bull5.position).normalize();
                }
                if(bull6.intersectsMesh(boss)) {
                    bull6.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction6 = boss.position.subtract(bull6.position).normalize();
                }
                if(bull7.intersectsMesh(boss)) {
                    bull7.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction7 = boss.position.subtract(bull7.position).normalize();
                }
                if(bull8.intersectsMesh(boss)) {
                    bull8.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction8 = boss.position.subtract(bull8.position).normalize();
                }
                if(bull9.intersectsMesh(boss)) {
                    bull9.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction9 = boss.position.subtract(bull9.position).normalize();
                }
                if(bull10.intersectsMesh(boss)) {
                    bull10.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction10 = boss.position.subtract(bull10.position).normalize();
                }
                bull.position.addInPlace(direction.scale(speedP*Vector3.Distance(bull.position, boss.position)));
                bull1.position.addInPlace(direction1.scale(speedP*0.7*Vector3.Distance(bull1.position, boss.position)));
                bull2.position.addInPlace(direction2.scale(speedP*0.3*Vector3.Distance(bull2.position, boss.position)));
                bull3.position.addInPlace(direction3.scale(speedP));
                bull4.position.addInPlace(direction4.scale(speedP));
                bull5.position.addInPlace(direction5.scale(speedP));
                bull6.position.addInPlace(direction6.scale(speedP));
                bull7.position.addInPlace(direction7.scale(speedP));
                bull8.position.addInPlace(direction8.scale(speedP));
                bull9.position.addInPlace(direction9.scale(speedP));
                bull10.position.addInPlace(direction10.scale(speedP));
                this.Reimu.position.addInPlace(directionP.scale(drag));
    
    
                if ((meshes[2].intersectsMesh(bullR) || meshes[2].intersectsMesh(bullB))&& touched == 0) {
                    touched = 256;
                    bullR.position = new Vector3(-10,8,3);
                    bullB.position = new Vector3(-10,8,-3);
                } 
    
                if (meshes[2].intersectsMesh(bull) && touched == 0) {
                    touched = 256;
                    bull.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull1) && touched == 0) {
                    touched = 256;
                    bull1.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction1 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull2) && touched == 0) {
                    touched = 256;
                    bull2.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction2 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull3) && touched == 0) {
                    touched = 256;
                    bull3.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction3 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull4) && touched == 0) {
                    touched = 256;
                    bull4.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction4 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull5) && touched == 0) {
                    touched = 256;
                    bull5.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction5 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull6) && touched == 0) {
                    touched = 256;
                    bull6.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction6 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull7) && touched == 0) {
                    touched = 256;
                    bull7.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction7 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull8) && touched == 0) {
                    touched = 256;
                    bull8.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction8 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull9) && touched == 0) {
                    touched = 256;
                    bull9.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction9 = boss.position.subtract(bull.position).normalize();
                } 
                if (meshes[2].intersectsMesh(bull10) && touched == 0) {
                    touched = 256;
                    bull10.position = new Vector3(
                        Math.random()*100/3,Math.random()*100/3,-16+Math.random()*100/3
                    );
                    direction10 = boss.position.subtract(bull.position).normalize();
                } 
            })
        },2000);
        }

    
    CreateSkybox(): void{
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", this.scene);
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

    switchToEndingScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new EndingScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}