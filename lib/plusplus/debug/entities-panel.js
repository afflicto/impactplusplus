ig.module(
        'plusplus.debug.entities-panel'
    )
    .requires(
        'plusplus.core.config',
        'plusplus.core.game',
        'plusplus.core.entity',
        'plusplus.debug.menu'
    )
    .defines(function () {
        "use strict";

        var _c = ig.CONFIG;

        ig.GameExtended.inject({

            draw: function () {

                this.parent();
				
				this._debugDraw();

            },

            _debugDraw: function () {

                for (var i = 0, il = this.layers.length; i < il; i++) {

                    var layer = this.layers[ i ];

                    var items = layer.items;

                    for (var j = 0, jl = items.length; j < jl; j++) {

                        var item = items[ j ];

                        var context = ig.system.context;

                        var screenX;
                        var screenY;

                        if (item.fixed) {

                            screenX = 0;
                            screenY = 0;

                        }
                        else {

                            screenX = this.screen.x;
                            screenY = this.screen.y;

                        }

                        // vertices
                        if (ig.EntityExtended._debugShowVertices && item.vertices) {

                            var vertices = item.vertices;

                            for (var i = 0, il = vertices.length; i < il; i++) {

                                this._debugDrawLine(item, this._debugColors.vertices,
                                    item.getCenterX() + vertices[ i ].x, item.getCenterY() + vertices[ i ].y,
                                    item.getCenterX() + vertices[ i === il - 1 ? 0 : i + 1 ].x, item.getCenterY() + vertices[ i === il - 1 ? 0 : i + 1 ].y
                                );

                            }

                        }

                        // bounds
                        if (ig.EntityExtended._debugShowBounds && item.pos) {

                            context.strokeStyle = this._debugColors.boxes;
                            context.lineWidth = 1.0;
                            context.strokeRect(
                                ig.system.getDrawPos(item.pos.x - screenX) - 0.5,
                                ig.system.getDrawPos(item.pos.y - screenY) - 0.5,
                                item.size.x * ( item.scale || ig.system.scale ),
                                item.size.y * ( item.scale || ig.system.scale )
                            );

                        }
                        // bounds draw
                        if (ig.EntityExtended._debugShowBoundsDraw && item.posDraw) {

                            context.strokeStyle = this._debugColors.boxesDraw;
                            context.lineWidth = 1.0;
                            context.strokeRect(
                                ig.system.getDrawPos(item.posDraw.x - screenX) - 0.5,
                                ig.system.getDrawPos(item.posDraw.y - screenY) - 0.5,
                                item.sizeDraw.x * ( item.scale || ig.system.scale ),
                                item.sizeDraw.y * ( item.scale || ig.system.scale )
                            );

                        }

                        // Velocities
                        if (ig.EntityExtended._debugShowVelocities && item.pos && item.size) {
                            var x = item.pos.x + item.size.x / 2;
                            var y = item.pos.y + item.size.y / 2;

                            this._debugDrawLine(item, this._debugColors.velocities, x, y, x + item.vel.x, y + item.vel.y);
                        }

                        // Names & Targets
                        if (ig.EntityExtended._debugShowNames && item.pos && item.size) {

                            context.fillStyle = this._debugColors.names;
                            context.fillText(
                                "[ " + item.layerName + ' | ' + item.id + " ]" + ( item.name ? " " + item.name : '' ),
                                ig.system.getDrawPos(item.pos.x - screenX),
                                ig.system.getDrawPos(item.pos.y - screenY)
                            );

                            if (typeof(item.target) == 'object') {
                                for (var t in item.target) {
                                    var ent = ig.game.namedEntities[item.target[t]];
                                    if (ent) {
                                        this._debugDrawLine(item, this._debugColors.names,
                                            item.pos.x + item.size.x * 0.5, item.pos.y + item.size.y * 0.5,
                                            ent.pos.x + ent.size.x * 0.5, ent.pos.y + ent.size.y * 0.5
                                        );
                                    }
                                }
                            }
                        }

                    }

                    if (layer.debugPhysics) {

                        layer.debugPhysics.draw();

                    }

                }

            },

            _debugColors: {
                names: '#fff',
                velocities: '#0f0',
                boxes: '#0066FF',
                boxesDraw: '#00FF77',
                vertices: '#f00'
            },

            _debugDrawLine: function (item, color, sx, sy, dx, dy) {

                var screenX;
                var screenY;

                if (item.fixed) {

                    screenX = 0;
                    screenY = 0;

                }
                else {

                    screenX = this.screen.x;
                    screenY = this.screen.y;

                }

                ig.system.context.strokeStyle = color;
                ig.system.context.lineWidth = 1.0;

                ig.system.context.beginPath();
                ig.system.context.moveTo(
                    ig.system.getDrawPos(sx - screenX),
                    ig.system.getDrawPos(sy - screenY)
                );
                ig.system.context.lineTo(
                    ig.system.getDrawPos(dx - screenX),
                    ig.system.getDrawPos(dy - screenY)
                );
                ig.system.context.stroke();
                ig.system.context.closePath();

            }

        });

        ig.EntityExtended._debugEnableChecks = true;
        ig.EntityExtended._debugShowVelocities = false;
        ig.EntityExtended._debugShowNames = false;
        ig.EntityExtended._debugShowVertices = false;
        ig.EntityExtended._debugShowBounds = false;
        ig.EntityExtended._debugShowBoundsDraw = false;

        ig.EntityExtended.oldCheckPair = ig.EntityExtended.checkPair;
        ig.EntityExtended.checkPair = function (a, b) {
            if (!ig.EntityExtended._debugEnableChecks) {
                return;
            }
            ig.EntityExtended.oldCheckPair(a, b);
        };

        ig.debug.addPanel({
            type: ig.DebugPanel,
            name: 'entities',
            label: 'Entities',
            options: [
                {
                    name: 'Show Names & Targets',
                    object: ig.EntityExtended,
                    property: '_debugShowNames'
                },
                {
                    name: 'Checks & Collisions',
                    object: ig.EntityExtended,
                    property: '_debugEnableChecks'
                },
                {
                    name: 'Show Velocities',
                    object: ig.EntityExtended,
                    property: '_debugShowVelocities'
                },
                {
                    name: 'Show Collision Boxes',
                    object: ig.EntityExtended,
                    property: '_debugShowBounds'
                },
                {
                    name: 'Show Drawing Boxes',
                    object: ig.EntityExtended,
                    property: '_debugShowBoundsDraw'
                },
                {
                    name: 'Show Vertex Boxes',
                    object: ig.EntityExtended,
                    property: '_debugShowVertices'
                }
            ]
        });

    });