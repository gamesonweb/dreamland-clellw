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
    Sound,
    CreateSoundAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { ThirdHubScene } from "./ThirdHubScene";

export class TransitionCutsceneNazrinEnd { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Nazrin!: AbstractMesh;
    Doremy!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateSkybox();
        this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

        this.CreateCutscene();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });
    }

    CreateScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,1), scene);
        hemiLight.intensity = 1.5;

        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
        };
        
        this.CreateCamera(scene);
        this.CreateMap();

        this.CreateReimu();

        return scene;

    }

    async CreateMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_hub_draft.glb");

        const doremy = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "doremy.glb"
        );
        this.Doremy = doremy.meshes[0];
        this.Doremy.scaling.setAll(0.4);
        this.Doremy.position = new Vector3(69,0,16);
        this.Doremy.rotate(Vector3.Up(), 3.1);
        this.Doremy.rotate(Vector3.Up(), 5*Math.PI/4);
        
        const nazrin = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "nazrin.glb"
        );
        this.Nazrin = nazrin.meshes[0];
        this.Nazrin.scaling.setAll(0.4);
        this.Nazrin.position = new Vector3(66,0,18);
        this.Nazrin.rotate(Vector3.Up(), 3.1);
        this.Nazrin.rotate(Vector3.Up(), Math.PI);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(69,0,19);
        this.Reimu.position._z += 0.5;
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(), -Math.PI/4);
        //this.camera.setTarget(meshes[2]);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(64,2,13), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/16,Math.PI/4,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Nazrin: Ow, my head hurts... What happened to me?");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Nazrin_sad.png";
        imgDiv.appendChild(img);
        img.style.height = "190px";
        imgDiv.style.top= '60%';
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
        newDiv.style.borderColor= 'grey';
        newDiv.style.borderStyle= 'ridge';
        newDiv.style.fontFamily= 'Lucida Console';

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
            "audio/01.RevolvingSecretGarden.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        camkeys.push({frame:0*fps, value:new Vector3(64,2,13)});
        camkeys.push({frame:6*fps, value:new Vector3(64,2,13)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        
        document.body.appendChild(newDiv); 
        document.body.appendChild(imgDiv); 
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: You were stuck inside your dream, but Reimu got you out without much casualties."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        this.Nazrin.rotate(Vector3.Up(), Math.PI);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Nazrin: Really? Thank you Reimu. I was so bored of that dream."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'grey';
        img.src = "portraits/Nazrin_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: You mean you remember what happened?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Nazrin: Why would I want to live in a world where I own everything? I'm a dowser, not a god!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'grey';
        img.src = "portraits/Nazrin_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: You can't really control what's happening in your dreams..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Glad it's over at least."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        this.Doremy.rotate(Vector3.Up(), Math.PI/4);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Our work isn't done Reimu. others persons are in danger!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Reimu.rotate(Vector3.Up(), -Math.PI/4);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Fine. Where do we need to go next?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        this.Doremy.rotate(Vector3.Up(), Math.PI);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: On top of this mountain. Someone there is stuck inside a dream."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";

        camkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(64,2,13)});
        camkeys.push({frame:2*fps, value:new Vector3(70,5,3)});
        camkeys.push({frame:4*fps, value:new Vector3(70,5,3)});
        rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,Math.PI/4,0)});
        rotkeys.push({frame:2*fps, value:new Vector3(-Math.PI/14,3*Math.PI/4,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/14,3*Math.PI/4,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I really wished we didn't have to go to youkai mountain..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
        
        camkeys = [];
        rotkeys = [];
        
        camkeys.push({frame:0*fps, value:new Vector3(70,5,3)});
        camkeys.push({frame:4*fps, value:new Vector3(70,5,3)});
        rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/14,3*Math.PI/4,0)});
        rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/14,3*Math.PI/4,0)});

        camAnim.setKeys(camkeys);
        rotationAnim.setKeys(rotkeys);
        this.camera.animations.push(camAnim);
        this.camera.animations.push(rotationAnim);
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Nazrin: You have to save another person? Good luck then!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'grey';
        img.src = "portraits/Nazrin_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToThirdHubScene();
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

    switchToThirdHubScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        this.scene = new ThirdHubScene(this.canvas).scene;
    }
}