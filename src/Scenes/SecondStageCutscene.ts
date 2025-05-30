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
import { SecondStageScene } from "./SecondStageScene";

export class SecondStageCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    camera!: FreeCamera;

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

        this.CreateCutscene();
    }

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
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }

    
    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(-23,7,-33), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(Math.PI/4,-Math.PI/2,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
            
            const fps = 60;
    
            const newDiv = document.createElement("div"); 
            let newContent = document.createTextNode("Reimu: Okay now, this place is a complete mess! What happened in here?");
            newDiv.appendChild(newContent);
            
            const imgDiv = document.createElement("div"); 
            const img = new Image();
            img.src = "portraits/Reimu_angry.png";
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
            "audio/05.Mt.Horn.mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            
            camkeys.push({frame:0, value:new Vector3(-23,7,-33)});
            camkeys.push({frame:6*fps, value:new Vector3(-21,9,-33)});
            rotkeys.push({frame:0, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Don't call it a mess! Besides, I didn't ask you for your opinion!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_angry.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(-21,9,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-21,9,-33)});
            rotkeys.push({frame:0, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/8,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: It's a mess, no matter how you look at it! So I will continue calling it a mess!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_angry.png";

            rotkeys = [];
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/8,-Math.PI/2,0)});
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: You should learn your place in this realm, human.");
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(-21,9,-33)});
            camkeys.push({frame:2*fps, value:new Vector3(-34,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-34,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: I own all the capital of the world, therefore, the things out of my reach are none. I can show you what I truly mean!");
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_happy.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-34,6,-33)});
            camkeys.push({frame:6*fps, value:new Vector3(-34,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: huh-huh?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: At first, we only had one mine, so we didn't have enough money...");
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-34,6,-33)});
            camkeys.push({frame:2*fps, value:new Vector3(-32,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-32,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: So I built two others!");
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_happy.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-32,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-32,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: How can you build a mine without gold to extract?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: With money! How else?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Wha-"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_surprised.png";
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: With this much money, it was time to make profit!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_casual.png";

            camkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-32,6,-33)});
            camkeys.push({frame:2*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-23,6,-33)});
            camAnim.setKeys(camkeys);
            this.camera.animations.push(camAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Therefore, I bought the lives of all the peasants of this village and built two market places, next to each other."); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_angry.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-23,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: That is NOT how you make profi-"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:3*fps, value:new Vector3(-23,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
            rotkeys.push({frame:3*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Then I realized we wouldn't have enough water with only one water mill..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_sad.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:2*fps, value:new Vector3(-27,12,-18)});
            camkeys.push({frame:4*fps, value:new Vector3(-27,12,-18)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,-Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/2,0,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: So I built two others!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-27,12,-18)});
            camkeys.push({frame:4*fps, value:new Vector3(-27,12,-18)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/2,0,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Then I had to build war buildings in order to rule the land with authority."); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-27,12,-18)});
            camkeys.push({frame:2*fps, value:new Vector3(-29,20,-42)});
            camkeys.push({frame:5*fps, value:new Vector3(-29,20,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(Math.PI/2,0,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: I had to protect my most valuable ressources, so that the peasants wouldn't lay a hand on them!"); 
            newDiv.appendChild(newContent);
            img.src = "portraits/Nazrin_angry.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-29,20,-42)});
            camkeys.push({frame:2*fps, value:new Vector3(-23,15,-42)});
            camkeys.push({frame:5*fps, value:new Vector3(-23,15,-42)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(Math.PI/2,0,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: ... Okay... And what are those mini-surrounded-by-water-hills-of-sand?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-23,15,-42)});
            camkeys.push({frame:2*fps, value:new Vector3(-17,5,-33)});
            camkeys.push({frame:5*fps, value:new Vector3(-17,5,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/2,0,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Seaside resorts!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-17,5,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-17,5,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Damn, to think your dream is worse than Cirno's..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Do you now understand the power I hold?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-17,5,-33)});
            camkeys.push({frame:2*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:4*fps, value:new Vector3(-23,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,-Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Not at all!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(-23,6,-33)});
            camkeys.push({frame:5*fps, value:new Vector3(-23,6,-33)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,-Math.PI/2,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(0,-Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Of course, you are not worthy of my VISION."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Nazrin: Well, it doesn't matter! You will not be able to refuse it anyway."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'grey';
            img.src = "portraits/Nazrin_happy.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            
        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToSecondStageScene();
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

    switchToSecondStageScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new SecondStageScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}