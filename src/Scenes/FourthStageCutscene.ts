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
import { FourthStageScene } from "./FourthStageScene";

export class FourthStageCutscene { 

    scene: Scene;
    engine: Engine;
    Reimu!: AbstractMesh;
    Sanae!: AbstractMesh;
    camera!: FreeCamera;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateStageFourScene();
        this.CreateSkybox();

        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })

        window.addEventListener("resize", () => {
                this.engine.resize;
        });

        this.CreateCutscene();
    }
    

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
        this.Sanae = sanae.meshes[0];
        this.Sanae.scaling.setAll(0.1);
        this.Sanae.position = new Vector3(20,0,-15);
        //this.Sanae.position = new Vector3(23,2,-17);
        this.Sanae.rotate(Vector3.Up(), 3.1);
        this.Sanae.rotate(Vector3.Up(), -Math.PI/2)
        this.Sanae.rotate(Vector3.Forward(), Math.PI/2)
    }

    async CreateReimuStageFour(): Promise<void> {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Reimu_animated.glb"
          );
        this.Reimu = meshes[0];
        //this.Reimu.position = new Vector3(23,2,-8);
        this.Reimu.position = new Vector3(25,0,-17);
        this.Reimu.rotate(Vector3.Up(), -Math.PI/2);
        this.Reimu.scaling.setAll(0.1);
        console.log("animations", animationGroups);
        
        const idleAnim = animationGroups[1];
        const flightAnim = animationGroups[0];
        idleAnim.start(true, 1, idleAnim.from, idleAnim.to, false);
        flightAnim.stop();
    }
    
    CreateCamera(scene: Scene): void {
        this.camera = new FreeCamera("camera", new Vector3(25,1,-15), scene);
        this.camera.checkCollisions = false;
        this.camera.rotation = new Vector3(Math.PI/8,Math.PI,0);
        this.camera.speed = 0.5;
    }

    async CreateCutscene(): Promise<void>{
            
            const fps = 60;
    
            const newDiv = document.createElement("div"); 
            let newContent = document.createTextNode("Reimu: Hey, Doremy! Have you ever been to the outside world before?");
            newDiv.appendChild(newContent);
            
            const imgDiv = document.createElement("div"); 
            const img = new Image();
            img.src = "portraits/Reimu_casual.png";
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
            "audio/09.UndellaTown(Autumn-Winter-Spring).mp3",
            {
                volume: 0.25,
            }
        );
        music.play();
            
            camkeys.push({frame:0, value:new Vector3(25,1,-15)});
            camkeys.push({frame:6*fps, value:new Vector3(25,1,-15)});
            rotkeys.push({frame:0, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:6*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,6*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [Never, but I saw it's people's dreams a few times. Why do you ask?]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Do you know what's that building?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(25,1,-15)});
            camkeys.push({frame:4*fps, value:new Vector3(25,1,-15)});
            rotkeys.push({frame:0, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Doremy: [That looks like a school.]"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'purple';
            img.src = "portraits/Doremy_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(25,1,-15)});
            camkeys.push({frame:4*fps, value:new Vector3(25,1,-15)});
            rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Schools are next to the sea in the outside world? That's sounds cool!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0, value:new Vector3(25,1,-15)});
            camkeys.push({frame:2*fps, value:new Vector3(31,9,-11)});
            camkeys.push({frame:4*fps, value:new Vector3(31,9,-11)});
            rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,5*Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/4,5*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,5*Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: Hey, Reimu! fancy meetting you here!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(31,9,-11)});
            camkeys.push({frame:2*fps, value:new Vector3(21,1,-15)});
            camkeys.push({frame:4*fps, value:new Vector3(21,1,-15)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,5*Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/4,3*Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,3*Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: Did you came here to take a sun bath like me?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(21,1,-15)});
            camkeys.push({frame:4*fps, value:new Vector3(21,1,-15)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,3*Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/4,3*Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Not really, but shouldn't you be in a classroom right now?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            this.Reimu.position = new Vector3(21,0,-17);
            this.Reimu.rotate(Vector3.Up(), 3*Math.PI/4);
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(21,1,-15)});
            camkeys.push({frame:2*fps, value:new Vector3(23,1,-13)});
            camkeys.push({frame:4*fps, value:new Vector3(23,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/4,3*Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/16,10*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/16,10*Math.PI/8,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: Today is our day off!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(23,1,-13)});
            camkeys.push({frame:4*fps, value:new Vector3(23,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,10*Math.PI/8,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/16,10*Math.PI/8,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Then why are you here?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_happy.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: To take a sun bath!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_happy.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Well, that makes sense."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_bored.png";
            
            await this.scene.beginAnimation(this.camera,0,3*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: I love this place so much! I would never give it away for anything!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_happy.png";

            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(23,1,-13)});
            camkeys.push({frame:4*fps, value:new Vector3(23,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/16,10*Math.PI/8,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,2*Math.PI,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,2*Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: If not for the messed up sky, I'm sure this place would look nice."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(23,1,-13)});
            camkeys.push({frame:4*fps, value:new Vector3(23,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,2*Math.PI,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,2*Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: ..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            await this.scene.beginAnimation(this.camera,0,2*fps).waitAsync();
            
            this.Sanae.rotate(Vector3.Forward(), -Math.PI/2);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: All of this isn't real, isn't it?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_angry.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Huh? You realized?"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_surprised.png";

            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: Even if it's not exactly the same, this place looks like the one I remember from the outside world."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(23,1,-15)});
            camkeys.push({frame:2*fps, value:new Vector3(20,1,-13)});
            camkeys.push({frame:5*fps, value:new Vector3(20,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,2*Math.PI,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:5*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,5*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: It holds a very special place in my heart!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(20,1,-13)});
            camkeys.push({frame:4*fps, value:new Vector3(20,1,-13)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: ...But I do not belong here anymore."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Sanae, I would really like to help you..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_sad.png";
            
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: It's okay, Reimu. I know what I have to do now!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";

            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: I am not honoring my memories of this place like this!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_angry.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(20,1,-13)});
            camkeys.push({frame:2*fps, value:new Vector3(20,1,-17)});
            camkeys.push({frame:4*fps, value:new Vector3(20,1,-17)});
            rotkeys.push({frame:0*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(-Math.PI/16,3*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,3*Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: I am now a resident of Gensokyo! And I have so many friends there!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_happy.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(20,1,-17)});
            camkeys.push({frame:4*fps, value:new Vector3(20,1,-17)});
            rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,3*Math.PI/4,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(-Math.PI/16,3*Math.PI/4,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            this.Reimu.position = new Vector3(23,2,-8);
            this.Sanae.position = new Vector3(23,2,-15);
            this.Reimu.rotate(Vector3.Up(), -3*Math.PI/4);
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: Reimu! Let's have a battle now!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(20,1,-17)});
            camkeys.push({frame:2*fps, value:new Vector3(17,1,-12)});
            camkeys.push({frame:4*fps, value:new Vector3(17,1,-12)});
            rotkeys.push({frame:0*fps, value:new Vector3(-Math.PI/16,3*Math.PI/4,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(0,Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Sanae: I want to leave this place with a blast!"); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'green';
            img.src = "portraits/Sanae_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(17,1,-12)});
            camkeys.push({frame:4*fps, value:new Vector3(17,1,-12)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,Math.PI/2,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(0,Math.PI/2,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();
            
            newDiv.removeChild(newContent);
            newContent = document.createTextNode("Reimu: Alright Sanae, if that's what you want..."); 
            newDiv.appendChild(newContent);
            newDiv.style.borderColor= 'red';
            img.src = "portraits/Reimu_casual.png";
            
            camkeys = [];
            rotkeys = [];
            camkeys.push({frame:0*fps, value:new Vector3(17,1,-12)});
            camkeys.push({frame:2*fps, value:new Vector3(23,3,-6)});
            camkeys.push({frame:4*fps, value:new Vector3(23,3,-6)});
            rotkeys.push({frame:0*fps, value:new Vector3(0,Math.PI/2,0)});
            rotkeys.push({frame:2*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            rotkeys.push({frame:4*fps, value:new Vector3(Math.PI/8,Math.PI,0)});
            camAnim.setKeys(camkeys);
            rotationAnim.setKeys(rotkeys);
            this.camera.animations.push(camAnim);
            this.camera.animations.push(rotationAnim);
            await this.scene.beginAnimation(this.camera,0,4*fps).waitAsync();

        document.body.removeChild(newDiv);
        document.body.removeChild(imgDiv);

        music.stop();
        this.switchToFourthStageScene();
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

    switchToFourthStageScene() {
        if (this.scene) {
            this.scene.dispose();
        }
        this.engine.stopRenderLoop();
        const next = new FourthStageScene(this.canvas);
        setTimeout(() => {this.scene = next.scene;}, 200);
    }
}