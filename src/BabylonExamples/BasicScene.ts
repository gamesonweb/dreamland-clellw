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
import { FireProceduralTexture } from "@babylonjs/procedural-textures";
import "@babylonjs/loaders";

export class BasicScene {
    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: ArcRotateCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageFiveScene();
        //this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
        
    }
    
    CreateScene(): Scene {
        this.engine = new Engine(this.canvas, true);
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
        hemiLight.intensity = 2;


        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };

        const framesPerSecond = 60;
        const gravity = -9.81;
        scene.collisionsEnabled = true;
        scene.enablePhysics(new Vector3(0, gravity/framesPerSecond, 0));

        this.CreateCamera(scene);
        
        this.CreateMap();
        
        this.CreateReimu();

        return scene;

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

    /* ************************************************************************* */
    //methods for stage one:


    CreateStageOneScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
        hemiLight.intensity = 1;

        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
          };

        const framesPerSecond = 60;
        const gravity = -9.81;
        //scene.gravity = new Vector3(0, gravity/framesPerSecond, 0);
        scene.collisionsEnabled = true;
        scene.enablePhysics(new Vector3(0, gravity/framesPerSecond, 0));
        
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

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });

        return scene;

    }

    async CreateStageOneMap(): Promise<void> {

        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_1.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
            mesh.physicsImpostor = new PhysicsImpostor(
                mesh, 
                PhysicsImpostor.SphereImpostor
            );
            mesh.physicsImpostor.setScalingUpdated();
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
        cirno.meshes[2].physicsImpostor = new PhysicsImpostor(
            cirno.meshes[2], 
            PhysicsImpostor.BoxImpostor,
            {mass: 1, restitution: 1, friction: 1}
        )
        let health = 5;
        
        const needles = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "needles.glb"
        );

        needles.meshes[0].scaling.setAll(0.8);
        needles.meshes[0].position = new Vector3(30,11,-20);
        //needles.meshes[2].checkCollisions=true;

        this.scene.onBeforeRenderObservable.add(() => {
            needles.meshes[0].moveWithCollisions(needles.meshes[0].right.scaleInPlace(0.3));
            if (needles.meshes[2].intersectsMesh(cirno.meshes[2])) {
                const x = this.Reimu.position._x;
                const y = this.Reimu.position._y;
                const z = this.Reimu.position._z;
                needles.meshes[0].position._x = x-2;
                needles.meshes[0].position._y = y;
                needles.meshes[0].position._z = z;
                health-=1;
            } 
            map.meshes.forEach((mesh) => {
            if (needles.meshes[2].intersectsMesh(mesh)) {
                const x = this.Reimu.position._x;
                const y = this.Reimu.position._y;
                const z = this.Reimu.position._z;
                needles.meshes[0].position._x = x-2;
                needles.meshes[0].position._y = y;
                needles.meshes[0].position._z = z;
            } 
            if(health == 0) {
                this.scene = this.CreateScene();
            }
        })
    
        });
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
        bull.position = new Vector3(14,20,-20);
        const bull2 = MeshBuilder.CreateSphere("bull");
        bull2.position = new Vector3(14,20,-20);
        const bull3 = MeshBuilder.CreateSphere("bull");
        bull3.position = new Vector3(14,20,-20);
        const bull4 = MeshBuilder.CreateSphere("bull");
        bull4.position = new Vector3(14,20,-20);
        const bull5 = MeshBuilder.CreateSphere("bull");
        bull5.position = new Vector3(14,20,-20);

        let attackCycle = 0;
        let direction = this.Reimu.position.subtract(bull.position).normalize();
        let direction2 = this.Reimu.position.subtract(bull2.position).normalize();
        let direction3 = this.Reimu.position.subtract(bull3.position).normalize();
        let direction4 = this.Reimu.position.subtract(bull4.position).normalize();
        let direction5 = this.Reimu.position.subtract(bull5.position).normalize();
        
        //checking collisions between player and bullets

        this.scene.onBeforeRenderObservable.add(() => {
            if(attackCycle == 0) {
                bull.position = new Vector3(14,20,-20)
                direction = this.Reimu.position.subtract(bull.position).normalize();
                attackCycle = 600;
            }
            bull.position.addInPlace(direction.scale(0.07));
            if(attackCycle == 575) {
                bull2.position = new Vector3(14,20,-20)
                direction2 = this.Reimu.position.subtract(bull2.position).normalize();
            }
            bull2.position.addInPlace(direction2.scale(0.07));
            if(attackCycle == 550) {
                bull3.position = new Vector3(14,20,-20)
                direction3 = this.Reimu.position.subtract(bull3.position).normalize();
            }
            bull3.position.addInPlace(direction3.scale(0.07));
            if(attackCycle == 525) {
                bull4.position = new Vector3(14,20,-20)
                direction4 = this.Reimu.position.subtract(bull4.position).normalize();
            }
            bull4.position.addInPlace(direction4.scale(0.07));
            if(attackCycle == 500) {
                bull5.position = new Vector3(14,20,-20)
                direction5 = this.Reimu.position.subtract(bull5.position).normalize();
            }
            bull5.position.addInPlace(direction5.scale(0.07));
            attackCycle-=1;
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
    }


    /* ************************************************************************* */
    //methods for stage two:
    //starting Reimu position : this.Reimu.position = new Vector3(-25,5,-33);
    //this.Reimu.scaling.setAll(0.2)


    CreateStageTwoScene(): Scene {
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
        this.CreateStageTwoMap();

        this.CreateReimuStageTwo();
        
        const leftWall = MeshBuilder.CreateBox("wall", {size:50});
        leftWall.position = new Vector3(-40,0,-70);
        leftWall.checkCollisions = true;
        leftWall.visibility = 0;

        const rightWall = MeshBuilder.CreateBox("wall", {size:50});
        rightWall.position = new Vector3(-40,0,10);
        rightWall.checkCollisions = true;
        rightWall.visibility = 1;

        const backWall = MeshBuilder.CreateBox("wall", {size:50});
        backWall.position = new Vector3(-65,0,-35);
        backWall.checkCollisions = true;
        backWall.visibility = 1;

        const forthWall = MeshBuilder.CreateBox("wall", {size:50});
        forthWall.position = new Vector3(5,0,-35);
        forthWall.checkCollisions = true;
        forthWall.visibility = 1;

        const ceilling = MeshBuilder.CreateBox("wall", {size:50});
        ceilling.position = new Vector3(-40,45,-35);
        ceilling.checkCollisions = true;
        ceilling.visibility = 1;

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });

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

        let attackCycle = 299;
        const bulletSpeed = 0.07;
        let direction = this.Reimu.position.subtract(bull.position).normalize();
        let direction2 = this.Reimu.position.subtract(bull.position).normalize();
        let direction3 = this.Reimu.position.subtract(bull.position).normalize();
        
        //checking collisions between player and bullets

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

            attackCycle-=1;
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
    }


    /* ************************************************************************* */
    //methods for stage three:
    //Reimu starting position : this.Reimu.position = new Vector3(15,1,-31);
    //this.Reimu.scaling.setAll(0.6);


    CreateStageThreeScene(): Scene {
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

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });

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

        
        let Rcycle = 299;
        let Gcycle = 299;
        let Bcycle = 299;
        const Rspeed = 0.2;
        const Gspeed = 0.05;
        const Bspeed = 0.11;
        let Rdirection = this.Reimu.position.subtract(bull.position).normalize();
        let Gdirection = this.Reimu.position.subtract(bull.position).normalize();
        let Bdirection = this.Reimu.position.subtract(bull.position).normalize();

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

            Rcycle-=1;
            Bcycle-=1;
            Gcycle-=1;
        })
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

    
    /* ************************************************************************* */
    //methods for stage five: 


    CreateStageFiveScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
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

        const sumeriko = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sumeriko.glb"
        );
        sumeriko.meshes[0].scaling.setAll(0.4);
        sumeriko.meshes[0].position = new Vector3(-10,7,0);
        sumeriko.meshes[0].rotate(Vector3.Up(), 3.1);
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
        const drag = 0.02;
        
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

        this.scene.onBeforeRenderObservable.add(() => {
            directionP = boss.position.subtract(this.Reimu.position).normalize();
            directionR = this.Reimu.position.subtract(bullR.position).normalize();
            directionB = this.Reimu.position.subtract(bullB.position).normalize();
            if(Math.abs(accelR) >= 0.15) {
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
            /*this.Reimu.position.addInPlace(directionP.scale(drag));


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
            } */    
        })
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


    async CreateReimu(): Promise<void> {
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
    }

    async CreateMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_hub_draft.glb");
        map.meshes.forEach((mesh) => {
            // Enable collisions for each imported mesh
            mesh.checkCollisions = true;
        });
    }
}