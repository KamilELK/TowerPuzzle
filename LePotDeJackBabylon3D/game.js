; (function ($, window, document, undefined) {

    "use strict";

    var pluginName = "kamilvictor",
        defaults = {
            width: 500,
            height: 500,
            'filename': 'test.babylon'
        };

    function Plugin(element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            this.canvas = $('<canvas />').appendTo(this.element);
            $(this.canvas).width(this.settings.width);
            $(this.canvas).height(this.settings.height);

            this.engine = new BABYLON.Engine($(this.canvas).get(0), true);

            this.engine.enableOfflineSupport = false;
            var canvas = $(this.canvas).get(0);
            var engine = this.engine;

            var scene = new BABYLON.Scene(engine);
            var exposure = 0.2;
            var contrast = 0.6;

            var hdrTexture = new BABYLON.HDRCubeTexture("textures/room.hdr", scene, 512);
            var seamlessTexture = new BABYLON.HDRCubeTexture("textures/room.hdr", scene, 64, false, true, false, true);

            // Create the glass material
            var glass = new BABYLON.PBRMaterial("glass", scene);
            glass.refractionTexture = hdrTexture;
            glass.linkRefractionWithTransparency = false;
            glass.indexOfRefraction = 0.8;
            glass.alpha = 0.33
            glass.cameraExposure = exposure;
            glass.cameraContrast = contrast;
            glass.microSurface = 1;
            glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);

            // Create the wood material
            var wood = new BABYLON.PBRMaterial("wood", scene);
            wood.reflectionTexture = hdrTexture;
            wood.environmentIntensity = 1;
            wood.specularIntensity = 0.3;
            wood.cameraExposure = exposure;
            wood.cameraContrast = contrast;
            wood.reflectivityTexture = new BABYLON.Texture("textures/reflectivity.png", scene);
            wood.useMicroSurfaceFromReflectivityMapAlpha = true;
            wood.albedoColor = BABYLON.Color3.White();
            wood.albedoTexture = new BABYLON.Texture("textures/albedo.png", scene);

            // Create the metal material
            var metal = new BABYLON.PBRMaterial("metal", scene);
            metal.reflectionTexture = seamlessTexture;
            metal.microSurface = 0.76;
            metal.reflectivityColor = new BABYLON.Color3(0.9, 0.8, 0.1);
            metal.albedoColor = new BABYLON.Color3(0.05, 0.03, 0.01);
            metal.environmentIntensity = 0.85;
            metal.cameraExposure = 0.66;
            metal.cameraContrast = 1.66;

            // Create the red metal material
            var metalRed = new BABYLON.PBRMaterial("metalred", scene);
            metalRed.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            metalRed.albedoColor = new BABYLON.Color3(1, 0, 0);
            metalRed.reflectionTexture = seamlessTexture;
            metalRed.microSurface = 0.76;
            metalRed.cameraExposure = 0.66;
            metalRed.cameraContrast = 1.66;

            // Create the silver metal material
            var metalSilver = new BABYLON.PBRMaterial("metal", scene);
            metalSilver.reflectionTexture = seamlessTexture;
            metalSilver.microSurface = 0.76;
            metalSilver.reflectivityColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            metalSilver.albedoColor = new BABYLON.Color3(0.05, 0.03, 0.01);
            metalSilver.environmentIntensity = 0.85;
            metalSilver.cameraExposure = 0.66;
            metalSilver.cameraContrast = 1.66;

            var metalCube = new BABYLON.PBRMaterial("cube", scene);
            metalCube.reflectionTexture = seamlessTexture;
            metalCube.microSurface = 0.76;
            metalCube.reflectivityColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            metalCube.albedoColor = new BABYLON.Color3(0, 1, 0);
            metalCube.environmentIntensity = 0.85;
            metalCube.cameraExposure = 0.66;
            metalCube.cameraContrast = 1.66;

            var metalCubeBlack = new BABYLON.PBRMaterial("cube", scene);
            metalCubeBlack.reflectionTexture = seamlessTexture;
            metalCubeBlack.microSurface = 0.76;
            metalCubeBlack.reflectivityColor = new BABYLON.Color3(0,0,0);
            metalCubeBlack.albedoColor = new BABYLON.Color3(0,0,0);
            metalCubeBlack.environmentIntensity = 0.85;
            metalCubeBlack.cameraExposure = 0.66;
            metalCubeBlack.cameraContrast = 1.66;

            var metalCubePurpul = new BABYLON.PBRMaterial("cube", scene);
            metalCubePurpul.reflectionTexture = seamlessTexture;
            metalCubePurpul.microSurface = 0.76;
            metalCubePurpul.reflectivityColor = new BABYLON.Color3(0.6, 0.6, 0.6);
            metalCubePurpul.albedoColor = new BABYLON.Color3(0.552,0.062,0.89);
            metalCubePurpul.environmentIntensity = 0.85;
            metalCubePurpul.cameraExposure = 0.66;
            metalCubePurpul.cameraContrast = 1.66;

            // Set the material properties so they can be accessed later
            this.gold = metal;
            this.red = metalRed;
            this.silver = metalSilver;
            this.glass = glass;
            this.cube = metalCube;
            this.cubeBlack = metalCubeBlack;
            this.cubePurpul = metalCubePurpul;
            

            // Set the scene up
            scene.clearColor = new BABYLON.Color3(1, 1, 1);

            // Create the camera
            var camera = new BABYLON.ArcRotateCamera("camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

            // Enable the scene physics so balls will actually fall down
            scene.enablePhysics();

            // Make sure the camera we just created is the currently active camera.
            scene.activeCamera = camera;

            // Attacht the control of the camera to the scene
            // The second parameter makes sure it passes the scroll wheel action to the page
            scene.activeCamera.attachControl(canvas, true);

            // Fix the camera zoom
            scene.activeCamera.lowerRadiusLimit = scene.activeCamera.radius;
            scene.activeCamera.upperRadiusLimit = scene.activeCamera.radius;

            // Make sure the camera has the desired position
            scene.activeCamera.setPosition(new BABYLON.Vector3(7.24, 4.02, 5.59));


            // Enable the gravity and collisions
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            scene.collisionsEnabled = true;

            // The scene lighting
            var light0 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
            light0.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3);
            light0.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
            light0.groundColor = new BABYLON.Color3(1, 1, 1);

            var light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
            light1.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3);
            light1.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
            light1.groundColor = new BABYLON.Color3(0, 0, 0);

            // Attach the light1 object to the camera so moving te camera also moves the light
            // This makes sure the object looks like it's being turned instead of the camera
            light1.parent = camera;
            var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 0.3, 4.4, 4.4, 50, 1, scene, false);
            // Create the basic model which consists of two cylinders
            // The bottom of the vase
            

            // The glass cone
            var glassCone = this.createHollowCone(scene, 5, 3.8, 4, 50, glass);

            // The decal is used to print the logo on the vase
            var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
            decalMaterial.diffuseTexture = new BABYLON.Texture("textures/jackLogo.png", scene);
            decalMaterial.diffuseTexture.hasAlpha = true;
            decalMaterial.zOffset = -2;
            decalMaterial.diffuseTexture.si

            var decalSize = new BABYLON.Vector3(3, 3, 3);
            var position = new BABYLON.Vector3(1, 0.5, 1);
            var normal = new BABYLON.Vector3(0.65, 0, 0.75);
            var newDecal = BABYLON.Mesh.CreateDecal("decal", glassCone, position, normal, decalSize);
            newDecal.material = decalMaterial;

            glassCone.checkCollisions = true;

            glassCone.physicsImpostor = new BABYLON.PhysicsImpostor(glassCone, BABYLON.PhysicsImpostor.MeshImpostor,
                { mass: 0, restitution: 0.2 }, scene);

            // This loop makes sure the scene is constantly rendered
            engine.runRenderLoop(function () {
                scene.render();
            });

            // Create an empty array to hold all the balls
            this.balls = [];

            // Set the object property to the scene
            this.scene = scene;

            // Attach a click event handler to the ball selector
            var plugin = this;
            $('#add-a-ball li').click(function () {
                plugin.createBall($(this).text().trim().toLowerCase());
            });

            function refreshcylender(cylindre){
                glassCone.actionManager = new BABYLON.ActionManager(scene);
                cylindre.material = wood;
                cylindre.position.y = -2.4;
                // Create the impostors on the cylinder and the cone so the balls will bounce of on them
                cylindre.physicsImpostor = new BABYLON.PhysicsImpostor(cylindre, BABYLON.PhysicsImpostor.CylinderImpostor,
                    { mass: 0, restitution: 0 }, scene);

                cylindre.checkCollisions = true;

                //glassCone.isPickable = true;
            glassCone.actionManager
            .registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnLeftPickTrigger,
                    function (){
                        //glassCone.actionManager = new BABYLON.ActionManager(scene);
                        console.log("1er click")
                        
                        cylindre.dispose();
                        
                    }
                )
            )
            .then(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.NothingTrigger,
                    function () {
                        
                        console.log("2ieme click")
                        
                        var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 0.3, 4.4, 4.4, 50, 1, scene, false);
                        
                        refreshcylender(cylinder);
                    }
                )
            );
            }

            refreshcylender(cylinder);
            

            
       

        },

        // This function creates a hollow cone
        createHollowCone: function (scene, height, innerDiameter, outerDiameter, tess, material) {

            var inner = BABYLON.Mesh.CreateCylinder("inner", height, innerDiameter, innerDiameter, tess, 1, scene);
            var outer = BABYLON.Mesh.CreateCylinder("outer", height, outerDiameter, outerDiameter, tess, 1, scene);

            var innerCSG = BABYLON.CSG.FromMesh(inner);
            var outerCSG = BABYLON.CSG.FromMesh(outer);

            var subCSG = outerCSG.subtract(innerCSG);

            var newMesh = subCSG.toMesh("csg2", material, scene);

            scene.removeMesh(inner);
            scene.removeMesh(outer);

            return newMesh;
        },

        // This function creates a ball and adds it to the scene
        createBall: function (materialName) {
            switch (materialName) {
                case 'or':
                    this.balls.push(this.createBallObject(this.scene, this.gold, 0));
                    break;
                case 'rouge':
                    this.balls.push(this.createBallObject(this.scene, this.red, 0));
                    break;
                case 'argent':
                    this.balls.push(this.createBallObject(this.scene, this.silver, 0));
                    break;
                case 'cube':
                    this.balls.push(this.createCube(this.scene, this.cube, 0));
                    break;
                case 'cubeblack':
                    this.balls.push(this.createCube(this.scene, this.cubeBlack, 0));
                    break;
                case 'cubepurpul':
                    this.balls.push(this.createCube(this.scene, this.cubePurpul, 0));
                    break;
            }
        },

        // This function creates the actual ball object
        createBallObject: function (scene, material, index) {

            var ball = BABYLON.MeshBuilder.CreateSphere("ball", {
                height: 0.1,
                diameter: 1,
                diameterBottom: 0.5,
                tessallation: 15,
                updatable: true
            }, scene);

            var randomx = Math.random() * (1 - -1) + -1;
            var randomy = Math.random() * (5 - -5) + -5;
            var randomz = Math.random() * (1 - -1) + -1;

            ball.material = material;
            ball.position.y = 4;
            ball.position.x = randomx / 2;
            ball.position.z = randomz / 2;
            ball.updatePhysicsBody();

            ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor,
                { mass: 1, restitution: 0.1 }, scene);

            ball.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.1, 0), ball.getAbsolutePosition());

            ball.applyGravity = true;
            ball.checkCollisions = 1;

            return ball;
        },

        createCube: function (scene, material, index) {

            var cube = BABYLON.Mesh.CreateBox("cube",0.75, scene);

            var randomx = Math.random() * (1 - -1) + -1;
            var randomy = Math.random() * (5 - -5) + -5;
            var randomz = Math.random() * (1 - -1) + -1;

            cube.material = material;
            cube.position.y = 4;
            cube.position.x = randomx / 2;
            cube.position.z = randomz / 2;
            cube.updatePhysicsBody();

            cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.SphereImpostor,
                { mass: 1, restitution: 0.1 }, scene);

            cube.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.1, 0), cube.getAbsolutePosition());

            cube.applyGravity = true;
            cube.checkCollisions = 1;

            return cube;
        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

    

})(jQuery, window, document);