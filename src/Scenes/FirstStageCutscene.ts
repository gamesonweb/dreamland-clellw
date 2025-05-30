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
import { FirstStageScene } from "./FirstStageScene";

export class FirstStageCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: FreeCamera;

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

        this.CreateCutscene();
    }

    CreateStageOneScene(): Scene {
        this.engine.stopRenderLoop();
        const scene = new Scene(this.engine);
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0,1,0), scene);
        hemiLight.intensity = 1;

        scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.engine.enterPointerlock();
            if (evt.button === 1) this.engine.exitPointerlock();
          };
        
        this.CreateCamera(scene);

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

        return scene;

    }

    async CreateStageOneMap(): Promise<void> {

        const map = await SceneLoader.ImportMeshAsync("", "./map/", "scene_1.glb");

        const cirno = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "cirno.glb"
        );
        cirno.meshes[0].scaling.setAll(0.4);
        cirno.meshes[0].position = new Vector3(12,20,-20);
        cirno.meshes[0].rotate(Vector3.Up(), 3.1);
    }

    async CreateReimuStageOne(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        this.Reimu.position = new Vector3(30,11,-21);
        this.Reimu.scaling.setAll(0.4); // Scales the mesh to half its original size
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }
    
    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(26,13,-19), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(Math.PI/12,5*Math.PI/8,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
            
            const fps = 60;
    
            const newDiv = document.createElement("div"); 
            let newContent = document.createTextNode("Reimu: Wow, it's really cold in there, as expected.");
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
            "audio/03.CragsofLament.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            camkeys.push({frame:0, value:new Vector3(26,13,-19)});
            camkeys.push({frame:4*fps, value:new Vector3(26,13,-19)});

            camAnim.setKeys(camkeys);
            this.camera.animations.push(camAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [Reimu! can you hear me?]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Perfectly fine. I have entered Cirno's dream, althought I thought it would be a little more animated in there."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            camkeys = [];

            camkeys.push({frame:0*fps, value:new Vector3(26,13,-19)});
            camkeys.push({frame:2*fps, value:new Vector3(32,12,-19)});
            camkeys.push({frame:5*fps, value:new Vector3(32,12,-19)});
            rotkeys.push({frame:0, value:new Vector3(Math.PI/12,5*Math.PI/8,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,11*Math.PI/8,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Guess you can't imagine what's inside a fairy's dream."); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Reimu_bored.png";

            camkeys = [];
            rotkeys = [];
            
            camkeys.push({frame:0*fps, value:new Vector3(32,12,-19)});
            camkeys.push({frame:4*fps, value:new Vector3(32,12,-19)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,11*Math.PI/8,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [You now have to find Cirno, she can be anywhere, so stay focused!]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: Welcome to my lair, human!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'blue';
            img.src = "portraits/Cirno_casual.png";
            
            rotkeys = [];

            rotkeys.push({frame:0*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:1*fps, value:new Vector3(-Math.PI/16,11*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,11*Math.PI/8,0)});

            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Yep, found her."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            rotkeys = [];

            rotkeys.push({frame:1*fps, value:new Vector3(-Math.PI/16,11*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,11*Math.PI/8,0)});

            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: I am the STRONGEST here, NO ONE can stand up against me!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'blue';
            img.src = "portraits/Cirno_casual.png";
            
            camkeys = [];
            rotkeys = [];
            
            camkeys.push({frame:0*fps, value:new Vector3(32,12,-19)});
            camkeys.push({frame:2*fps, value:new Vector3(16,21,-19)});
            camkeys.push({frame:4*fps, value:new Vector3(16,21,-19)});
            rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,11*Math.PI/8,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,11*Math.PI/8,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: Even you, a shrine maiden, can only bow down before my-aa-aaah-"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Cirno_happy.png";

            camkeys = [];
            rotkeys = [];

            camkeys.push({frame:0*fps, value:new Vector3(16,21,-19)});
            camkeys.push({frame:4*fps, value:new Vector3(16,21,-19)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,11*Math.PI/8,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: ATCHOO!!!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Cirno_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: ..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";

            camkeys = [];
            rotkeys = [];

            camkeys.push({frame:0*fps, value:new Vector3(16,21,-19)});
            camkeys.push({frame:0.5*fps, value:new Vector3(20,15,-38)});
            camkeys.push({frame:2*fps, value:new Vector3(20,15,-38)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,11*Math.PI/8,0)});
            rotkeys.push({frame:0.5*fps, value:new Vector3(0,0,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,0,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: How can you sneeze? You're an ICE fairy!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            
            camkeys = [];
            rotkeys = [];
            
            camkeys.push({frame:0*fps, value:new Vector3(20,15,-38)});
            camkeys.push({frame:4*fps, value:new Vector3(20,15,-38)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,0,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,0,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: A 'bless you' would have been fine, you know!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'blue';
            img.src = "portraits/Cirno_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Cirno: If you're not gonna praise me, then I might as well get rid of you!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Cirno_happy.png";

            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Please Doremy, tell me how I can wake her up!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";
            
            camkeys = [];
            rotkeys = [];
            
            camkeys.push({frame:0*fps, value:new Vector3(20,15,-38)});
            camkeys.push({frame:3*fps, value:new Vector3(24,15,-25)});
            camkeys.push({frame:4*fps, value:new Vector3(24,15,-25)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,0,0)});
            rotkeys.push({frame:3*fps, value:new Vector3(Math.PI/7,Math.PI/3,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/7,Math.PI/3,0)});

            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: If I hear anymore from her, I could really send her dreaming inside her dream!"); 
            newDiv.appendChild(newContent);

            camkeys = [];
            rotkeys = [];
            
            camkeys.push({frame:0*fps, value:new Vector3(24,15,-25)});
            camkeys.push({frame:4*fps, value:new Vector3(24,15,-25)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/7,Math.PI/3,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/7,Math.PI/3,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
        
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: The easiest way would be to cut the link between her and the dreamworld's version of her."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: Fortunately, you can do that by knocking her out!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Doremy_happy.png";

            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Perfect! I'm an expert at this!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";

            camkeys = [];
            rotkeys = [];

            camkeys.push({frame:0*fps, value:new Vector3(24,15,-25)});
            camkeys.push({frame:4*fps, value:new Vector3(35,12,-21)});
            camkeys.push({frame:5*fps, value:new Vector3(35,12,-21)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/7,Math.PI/3,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,-Math.PI/2,0)});
            
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFirstStageScene();
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
    
    
    switchToFirstStageScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FirstStageScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}