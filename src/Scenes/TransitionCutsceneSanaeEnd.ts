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
import { FifthHubScene } from "./FifthHubScene";

export class TransitionCutsceneSanaeEnd { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Sanae!: AbstractMesh;
    skyboxMaterial!: StandardMaterial;
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
        
        window.addEventListener("resize", () => {
                this.engine.resize;
        });
        return scene;

    }

    async CreateMap(): Promise<void> {
        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_hub_draft.glb");

        const doremy = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "doremy.glb"
        );
        doremy.meshes[0].scaling.setAll(0.4);
        doremy.meshes[0].position = new Vector3(95,12,-72);
        doremy.meshes[0].position._x-=0.3;
        doremy.meshes[0].rotate(Vector3.Up(), 3.1);
        doremy.meshes[0].rotate(Vector3.Up(), 15*Math.PI/8);
        
        const sanae = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "sanae.glb"
        );
        this.Sanae = sanae.meshes[0];
        this.Sanae.scaling.setAll(0.4);
        this.Sanae.position = new Vector3(98,12,-71);
        this.Sanae.rotate(Vector3.Up(), 3.1);
        this.Sanae.rotate(Vector3.Up(), 3*Math.PI/4);
    }

    async CreateReimu(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(96,12,-70);
        this.Reimu.scaling.setAll(0.4); 
        this.Reimu.rotate(Vector3.Up(), -3*Math.PI/5);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(97,14,-75), scene);
        this.camera.checkCollisions = true;
        this.camera.rotation = new Vector3(Math.PI/12,-Math.PI/16,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
        
        const fps = 60;

        const newDiv = document.createElement("div"); 
        let newContent = document.createTextNode("Reimu: Now, where do we need to go, Doremy?");
        newDiv.appendChild(newContent);

        const imgDiv = document.createElement("div"); 
        const img = new Image();
        img.src = "portraits/Reimu_casual.png";
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
        newDiv.style.borderColor= 'red';
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
        
            camkeys = [];
            rotkeys = [];

        let music = await CreateSoundAsync("music",
            "audio/01.RevolvingSecretGarden.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
        camkeys.push({frame:0*fps, value:new Vector3(97,14,-75)});
        camkeys.push({frame:6*fps, value:new Vector3(97,14,-75)});

        camAnim.setKeys(camkeys);
        this.camera.animations.push(camAnim);
        await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
        document.body.appendChild(newDiv); 
        document.body.appendChild(imgDiv); 
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Well, I don't sense anyone dreaming right now."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Great! That means we can start looking for the culprit."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Where do we start? do I have to fall asleep to drag him to me?"); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Maybe that could-"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,1*fps).waitAsync();
        
        this.Sanae.rotate(Vector3.Up(), Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: OBJECTION!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: W-why did you scream at me?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Sorry! I really wanted to say that."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: But there is actually no need for you to fall asleep, Reimu. In fact..."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        this.Sanae.rotate(Vector3.Up(), Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: You are already inside a dream!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Sanae_angry.png";
        
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(97,14,-75)});
            camkeys.push({frame:2*fps, value:new Vector3(97,13,-75)});
            camkeys.push({frame:4*fps, value:new Vector3(97,13,-75)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/12,-Math.PI/16,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-Math.PI/16,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-Math.PI/16,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        music.stop();
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: ..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_bored.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(97,13,-75)});
            camkeys.push({frame:6*fps, value:new Vector3(96.2,13,-72)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/16,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(0,-Math.PI/16,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: W-What?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(96.2,13,-72)});
            camkeys.push({frame:6*fps, value:new Vector3(96.2,13,-72)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/16,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(0,-Math.PI/16,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
            this.SwitchSkybox();
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(96.2,13,-72)});
            camkeys.push({frame:2*fps, value:new Vector3(98,14.5,-75)});
            camkeys.push({frame:6*fps, value:new Vector3(98,14.5,-75)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/16,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,-Math.PI/8,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/8,-Math.PI/8,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

        music = await CreateSoundAsync("music",
            "audio/11.IntheFuture.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Wait... Are we really!?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_surprised.png";
        
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(98,14.5,-75)});
            camkeys.push({frame:6*fps, value:new Vector3(98,14.5,-75)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/8,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/8,-Math.PI/8,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
        this.Sanae.rotate(Vector3.Up(), -Math.PI/8);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: When I realised something seemed off with this place, I decided to fall asleep to try and find out what's happening."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Turns out the feeling I had in my dream is the same I have right now!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Sanae_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: You didn't realise it Reimu because the dreams you were in were not 'yours'."); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        this.Reimu.rotate(Vector3.Up(), -Math.PI/5);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: I didn't get that last part, but when you said 'something seemed off', you meant...?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Yes, this place has a lot of oddities."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: The Moriya Shrine and the Scarlet Devil Mansion are absent, the Youkai mountain is shaped differently, and more."); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: I then realised we might be inside a dream, because dreams are not exactly like reality!"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Sanae_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: How did I not realise that? I fell ashamed of myself."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_sad.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Don't feel like that. You were just fooled by your interpretation of this place, like all of us."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: But who is responsible for..."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Dreams... like reality?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Did you realise something, Reimu?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: We know someone who is able to reach Gensokyo, but only inside of her dreams."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: If something happened to her, it must be what started this mess."); 
        newDiv.appendChild(newContent);
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        this.Reimu.rotate(Vector3.Up(), Math.PI/3);
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: Doremy, don't you feel anything?"); 
        newDiv.appendChild(newContent);
        img.src = "portraits/Reimu_bored.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: Well, actually, someone dreaming is actually getting closer to us!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: She is moving while sleeping? That sounds cool!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_happy.png";
        
        await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Sanae: Wait. She's sleeping? does that mean she is dreaming inside the dream of her dream?"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'green';
        img.src = "portraits/Sanae_surprised.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Reimu: It doesn't matter. We may now be able to escape this dream."); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'red';
        img.src = "portraits/Reimu_casual.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
        
        newDiv.removeChild(newContent);
        newContent = document.createTextNode("Doremy: I will try and get her exact location. When I find her, get to us as fast as you can!"); 
        newDiv.appendChild(newContent);
        newDiv.style.borderColor= 'purple';
        img.src = "portraits/Doremy_angry.png";
        
        await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFifthHubScene();
    }
    
    CreateSkybox(): void {
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        this.skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        this.skyboxMaterial.backFaceCulling = false;
        this.skyboxMaterial.disableLighting = true;
        skybox.material = this.skyboxMaterial;
        skybox.infiniteDistance = true;
        this.skyboxMaterial.disableLighting = true;
        this.skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", this.scene);
        this.skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }

    SwitchSkybox(): void {
        this.skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox_d", this.scene);
    }

    switchToFifthHubScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        this.scene = new FifthHubScene(this.canvas).scene;
    }
}