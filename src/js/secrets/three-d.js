function setupCanvas(canvas, width, height) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

const canvas = document.getElementById("game");

const ctx = setupCanvas(canvas, 400, 400);
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);

const ANGLE = 0 //2 * Math.PI - 0.0003;
// 1. PITCH
pitch_unit_width = 70;
pitch_unit_height = 110;
scale_factor = 7
pitch_width = scale_factor * pitch_unit_width;
pitch_height = scale_factor * pitch_unit_height;


function rotate(point, angle) {
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const x = point.x
    const y = cos * point.y - sin * point.z
    const z = sin * point.y + cos * point.z
    return {
        x: x,
        y: y,
        z: z
    }
}

function project(point) {
    const x = point.x / point.z
    const y = (point.y) / point.z
    return {
        x: x,
        y: y
    }
}

function draw_points(points, close_path = false) {
    rotated_points = points.map(p => rotate(p, ANGLE))
    projected_points = rotated_points.map(p => project(p));
    console.log(projected_points)
    ctx.beginPath();
    projected_points.forEach((p, index) => {
        if (index === 0) {
            // Start the path at the first point
            ctx.moveTo(p.x, p.y);
        } else {
            // Draw lines to every point after that
            ctx.lineTo(p.x, p.y);
        }
    });
    if (close_path) {
        ctx.closePath();
    }
    ctx.stroke();
}

function draw_3d_arc(centerX, centerY, radius, startAngle, endAngle, segments = 20) {
    const arcPoints = [];

    for (let i = 0; i <= segments; i++) {
        // Interpolate between start and end angles
        const theta = startAngle + (endAngle - startAngle) * (i / segments);

        // Calculate point in "flat" 3D space (z=1 as per your code)
        arcPoints.push({
            x: centerX + Math.cos(theta) * radius,
            y: centerY + Math.sin(theta) * radius,
            z: 1
        });
    }

    // Use your existing draw_points function to project and render
    draw_points(arcPoints);
}

function draw_stripes(numStripes = 5) {
    const stripeHeight = 0.5 * pitch_height / numStripes;
    const startY = -pitch_height / 2;

    for (let i = 0; i < numStripes; i++) {
        // Toggle colors
        ctx.fillStyle = (i % 2 === 0) ? "#24701a" : "#21551b"; // Dark green / Light green

        // Define the 4 corners of the stripe in 3D space
        const yTop = startY + (i * stripeHeight);
        const yBottom = yTop + stripeHeight + 0.1;

        const stripePoints = [
            { x: -pitch_width / 2, y: yTop, z: 1 },
            { x: pitch_width / 2, y: yTop, z: 1 },
            { x: pitch_width / 2, y: yBottom, z: 1 },
            { x: -pitch_width / 2, y: yBottom, z: 1 }
        ];

        // We need a modified draw_points that uses fill instead of stroke
        fill_points(stripePoints);
    }
}

function fill_points(points) {
    const rotated = points.map(p => rotate(p, ANGLE));
    const projected = rotated.map(p => project(p));

    ctx.beginPath();
    projected.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
}

pitch = [
    { x: -pitch_width / 2, y: pitch_height / 2, z: 1 },
    { x: pitch_width / 2, y: pitch_height / 2, z: 1 },
    { x: pitch_width / 2, y: 0, z: 1 },
    { x: -pitch_width / 2, y: 0, z: 1 }
]
lower_six_yard_box = [
    { x: -10 * scale_factor, y: pitch_height / 2, z: 1 },
    { x: -10 * scale_factor, y: (pitch_height / 2) - (6 * scale_factor), z: 1 },
    { x: 10 * scale_factor, y: (pitch_height / 2) - (6 * scale_factor), z: 1 },
    { x: 10 * scale_factor, y: pitch_height / 2, z: 1 }
]
upper_six_yard_box = [
    { x: -10 * scale_factor, y: -pitch_height / 2, z: 1 },
    { x: -10 * scale_factor, y: (-pitch_height / 2) + (6 * scale_factor), z: 1 },
    { x: 10 * scale_factor, y: (-pitch_height / 2) + (6 * scale_factor), z: 1 },
    { x: 10 * scale_factor, y: -pitch_height / 2, z: 1 }
]
lower_eighteen_yard_box = [
    { x: -22 * scale_factor, y: pitch_height / 2, z: 1 },
    { x: -22 * scale_factor, y: (pitch_height / 2) - (18 * scale_factor), z: 1 },
    { x: 22 * scale_factor, y: (pitch_height / 2) - (18 * scale_factor), z: 1 },
    { x: 22 * scale_factor, y: pitch_height / 2, z: 1 }
]
upper_eighteen_yard_box = [
    { x: -22 * scale_factor, y: -pitch_height / 2, z: 1 },
    { x: -22 * scale_factor, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 },
    { x: 22 * scale_factor, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 },
    { x: 22 * scale_factor, y: -pitch_height / 2, z: 1 }
]
halfway_line = [
    { x: -pitch_width / 2, y: 0, z: 1 },
    { x: pitch_width / 2, y: 0, z: 1 }
]

py = 60;
dy = (pitch_height / 6) - (2 * py / 3);
dx = pitch_width / 5;
starting_x = pitch_width / 2;
players = [
    // line 1
    { x: 0, y: (-pitch_height / 2) + (6 * scale_factor), name: "P. Layer" },
    // line 2
    { x: -1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), name: "P. Layer" },
    { x: -.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), name: "P. Layer" },
    { x: .5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), name: "P. Layer" },
    { x: 1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), name: "P. Layer" },
    // line 3
    { x: -1.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), name: "P. Layer" },
    { x: -.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), name: "P. Layer" },
    { x: .5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), name: "P. Layer" },
    { x: 1.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), name: "P. Layer" },
    // line 4
    { x: -.5 * dx, y: -py, name: "P. Layer" },
    { x: .5 * dx, y: -py, name: "P. Layer" }
]

draw_stripes(6);
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
// draw pitch
draw_points(pitch, close_path = true)
// draw_points(lower_six_yard_box)
draw_points(upper_six_yard_box)
// draw_points(lower_eighteen_yard_box)
draw_points(upper_eighteen_yard_box)
draw_points(halfway_line)
// halfway circle
draw_3d_arc(0, 0, 10 * scale_factor, Math.PI, 2 * Math.PI, segments = 40)
// upper D
draw_3d_arc(0, (-pitch_height / 2) + (11 * scale_factor), 10 * scale_factor, 0.5 * Math.PI - 0.775, 0.5 * Math.PI + 0.775)
// lower D
// draw_3d_arc(0, (pitch_height / 2) - (11 * scale_factor), 10 * scale_factor, 1.5 * Math.PI - 0.775, 1.5 * Math.PI + 0.775)
// draw players

function draw_player(player, size = 20) {
    const offset = size / 2;
    const boxWidth = 100;
    const boxHeight = 20;

    // 1. Draw the Player Icon (Red Square)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x - offset, player.y - offset, size, size);

    // 2. Draw the Label Box (Yellow Rectangle)
    ctx.fillStyle = "yellow";
    const text_box_x = player.x - boxWidth / 2;
    const text_box_y = player.y + size; // Positioned below the icon
    ctx.fillRect(text_box_x, text_box_y, boxWidth, boxHeight);

    // 3. Draw the Text (Centered)
    ctx.fillStyle = "black";
    ctx.font = "12px sans-serif"; // Set a specific font size for consistency

    // Key Fixes:
    ctx.textAlign = "center";     // Horizontal alignment
    ctx.textBaseline = "middle";  // Vertical alignment

    // Draw text at the exact center of the yellow box
    ctx.fillText(
        player.name,
        text_box_x + (boxWidth / 2),
        text_box_y + (boxHeight / 2)
    );
}

for (player of players) {
    draw_player(player)
}