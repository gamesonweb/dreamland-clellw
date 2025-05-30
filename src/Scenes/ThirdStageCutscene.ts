import{
    Scene, 
    Engine, 
    FreeCamera,
    Vector3, 
    HemisphericLight, 
    SceneLoader,
    AbstractMesh,
    MeshBuilder,
    StandardMaterial,
    CubeTexture,
    Texture,
    Animation,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { ThirdStageScene } from "./ThirdStageScene";

export class ThirdStageCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Aya!:AbstractMesh;
    camera!: FreeCamera;

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

        this.CreateCutscene();
    }
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
        this.Aya = aya.meshes[0];
        this.Aya.scaling.setAll(0.7);
        this.Aya.position = new Vector3(42,1,-38);
    }

    async CreateReimuStageThree(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(15,1,-31);
        this.Reimu.scaling.setAll(0.6);
        this.Reimu.rotate(Vector3.Up(), Math.PI);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(21,3,-31), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(0,3*Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
            
            const fps = 60;
    
            const newDiv = document.createElement("div"); 
            let newContent = document.createTextNode("Reimu: Oh! We are indoors for once. That's a change from the previous dreams.");
            newDiv.appendChild(newContent);
            
            const imgDiv = document.createElement("div"); 
            const img = new Image();
            img.src = "portraits/Reimu_surprised.png";
            imgDiv.appendChild(img);
            img.style.height = "190px";
            imgDiv.style.top= '55%';
            imgDiv.style.left= "19%";
            imgDiv.style.margin= 'auto';
            imgDiv.style.position= 'absolute';
        
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
            newDiv.style.borderStyle= 'ridge ';
            newDiv.style.fontFamily= 'Lucida Console';
            document.body.appendChild(newDiv); 
            document.body.appendChild(imgDiv); 

            let camkeys = [];
            const camAnim = new Animation(
                "camAnim", 
                "position",
                fps,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CONSTANT,
                true
            );
    
            let rotkeys = [];
            const rotationAnim = new Animation(
                "rotationAnim",
                "rotation",
                fps,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CONSTANT,
                true
            );
        const music = await CreateSoundAsync("music",
            "audio/07.IntheNightmare.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            
            camkeys.push({frame:0, value:new Vector3(21,3,-31)});
            camkeys.push({frame:5*fps, value:new Vector3(21,3,-31)});
            rotkeys.push({frame:0, value:new Vector3(0,3*Math.PI/2,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,3*Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: I was waiting for you, Reimu."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(21,3,-31)});
            camkeys.push({frame:2*fps, value:new Vector3(35,3,-42)});
            camkeys.push({frame:4*fps, value:new Vector3(35,3,-42)});
            rotkeys.push({frame:0, value:new Vector3(0,3*Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: No, you were not!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(35,3,-42)});
            camkeys.push({frame:4*fps, value:new Vector3(35,3,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: It's been quite a long time since we last met."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Is it really?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: My name is Shameimaru Aya. It is my business to know what other people do not know."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(35,3,-42)});
            camkeys.push({frame:2*fps, value:new Vector3(45,3,-42)});
            camkeys.push({frame:5*fps, value:new Vector3(45,3,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-Math.PI/4,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,-Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: I know you and your job already Aya. Why do you have to remind me?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(45,3,-42)});
            camkeys.push({frame:7*fps, value:new Vector3(45,3,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/4,0)});
            rotkeys.push({frame:7*fps, value:new Vector3(0,-Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: What you do in this world is a matter of no consequence. The question is what can you make people believe you have done."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,7*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Did Yukari started giving you 'How to be annoying with Reimu' lessons?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: Crime is common. Logic is rare. Therefore it is upon the logic rather than upon the crime that you should dwell."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(45,3,-42)});
            camkeys.push({frame:2*fps, value:new Vector3(65,3,-42)});
            camkeys.push({frame:7*fps, value:new Vector3(65,3,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:7*fps, value:new Vector3(0,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,7*fps).waitAsync();
            
            this.Aya.position = new Vector3(54,1,-20);
            this.Aya.rotate(Vector3.Up(), Math.PI);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: I chose Logic as my dwelling. What was your choice, Reimu?"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Aya_angry.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(65,3,-42)});
            camkeys.push({frame:6*fps, value:new Vector3(65,3,-20)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(0,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: For my own good, I will not answer that question."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(65,3,-20)});
            camkeys.push({frame:4*fps, value:new Vector3(65,3,-20)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: This is not like you at all Aya! I will have to knock some senses into you!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(65,3,-20)});
            camkeys.push({frame:2*fps, value:new Vector3(21,3,-27)});
            camkeys.push({frame:5*fps, value:new Vector3(21,3,-27)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-2*Math.PI/3,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,-2*Math.PI/3,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            this.Aya.position = new Vector3(50,5,-31);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: It seems it can't be helped then..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'orange';
            img.src = "portraits/Aya_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(21,3,-27)});
            camkeys.push({frame:2*fps, value:new Vector3(30,5,-27)});
            camkeys.push({frame:4*fps, value:new Vector3(30,5,-27)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-2*Math.PI/3,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-4*Math.PI/3,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-4*Math.PI/3,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            this.Aya.rotate(Vector3.Up(), -Math.PI);
            this.Reimu.position = new Vector3(15,5,-31);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Aya: Brace yourself, Reimu! The Game Is On!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Aya_angry.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(30,5,-27)});
            camkeys.push({frame:2*fps, value:new Vector3(7,7,-31)});
            camkeys.push({frame:4*fps, value:new Vector3(7,7,-31)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-4*Math.PI/3,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-3*Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-3*Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToThirdStageScene();
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

    switchToThirdStageScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new ThirdStageScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}