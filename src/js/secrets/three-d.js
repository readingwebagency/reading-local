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

var dpr = window.devicePixelRatio || 1;
// set size of css element
canvas.style.width = 800 + 'px';
canvas.style.height = 800 + 'px';
// set size of canvas
canvas.width = 800 * dpr;
canvas.height = 800 * dpr;
const ctx = canvas.getContext('2d');
ctx.translate(canvas.width / 2, canvas.height / 2 + 300);
ctx.scale(dpr, dpr);

//ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
//ctx.shadowBlur = 10;
//ctx.shadowOffsetY = 5;

ctx.save();

const gradient = ctx.createLinearGradient(0, -canvas.height / 2, 0, canvas.height / 2);
gradient.addColorStop(0, "#00bfff");
gradient.addColorStop(1, "#ff0000");

ctx.fillStyle = gradient;
ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

const ANGLE = 2 * Math.PI - 0.0005;
// 1. PITCH
pitch_unit_width = 70;
pitch_unit_height = 110;
scale_factor = 9;
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
    { x: -pitch_width / 2, y: -pitch_height / 2, z: 1 },
    { x: pitch_width / 2, y: -pitch_height / 2, z: 1 },
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
    { name: "Raya" },
    { name: "Timber" },
    { name: "Saliba" },
    { name: "Gabriel" },
    { name: "Lewis-Skelly" },
    { name: "Odegaard" },
    { name: "Partey" },
    { name: "Rice" },
    { name: "Saka" },
    { name: "Havertz" },
    { name: "Martinelli" }
]

const formations = {
    "4-4-2": [
        // GK
        { coords: { x: 0, y: (-pitch_height / 2) + (6 * scale_factor), z: 1 } },
        // Defence
        { coords: { x: -1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: -.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: .5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: 1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        // Midfield
        { coords: { x: -1.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        { coords: { x: -.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        { coords: { x: .5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        { coords: { x: 1.5 * dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        // Attack
        { coords: { x: -.5 * dx, y: -py, z: 1 } },
        { coords: { x: .5 * dx, y: -py, z: 1 } }
    ],
    "4-3-3": [
        // GK
        { coords: { x: 0, y: (-pitch_height / 2) + (6 * scale_factor), z: 1 } },
        // Defence
        { coords: { x: -1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: -.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: .5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: 1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        // Midfield
        { coords: { x: -dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        { coords: { x: 0, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        { coords: { x: dx, y: (-pitch_height / 2) + (35 * scale_factor), z: 1 } },
        // Attack
        { coords: { x: -1.5 * dx, y: -py, z: 1 } },
        { coords: { x: 0, y: -py, z: 1 } },
        { coords: { x: 1.5 * dx, y: -py, z: 1 } }
    ],
    "4-2-3-1": [
        // GK
        { coords: { x: 0, y: (-pitch_height / 2) + (6 * scale_factor), z: 1 } },
        // Defence
        { coords: { x: -1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: -.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: .5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        { coords: { x: 1.5 * dx, y: (-pitch_height / 2) + (18 * scale_factor), z: 1 } },
        // Defensive Midfield
        { coords: { x: -.5 * dx, y: (-pitch_height / 2) + (28 * scale_factor), z: 1 } },
        { coords: { x: .5 * dx, y: (-pitch_height / 2) + (28 * scale_factor), z: 1 } },
        // Attacking Midfield
        { coords: { x: -1.5 * dx, y: (-pitch_height / 2) + (38 * scale_factor), z: 1 } },
        { coords: { x: 0, y: (-pitch_height / 2) + (38 * scale_factor), z: 1 } },
        { coords: { x: 1.5 * dx, y: (-pitch_height / 2) + (38 * scale_factor), z: 1 } },
        // Striker
        { coords: { x: 0, y: -py, z: 1 } }
    ]
}

const titlePoint = { x: 0, y: (-pitch_height / 2)};
ctx.fillStyle = "black";
ctx.font = "bold 30px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Starting XI", titlePoint.x, titlePoint.y);

draw_stripes(6);
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
// draw pitch
draw_points(pitch, close_path = true)
// draw_points(lower_six_yard_box)
draw_points(upper_six_yard_box)
// draw_points(lower_eighteen_yard_box)
draw_points(upper_eighteen_yard_box)
// draw_points(halfway_line)
// halfway circle
draw_3d_arc(0, 0, 10 * scale_factor, Math.PI, 2 * Math.PI, segments = 40)
// upper D
draw_3d_arc(0, (-pitch_height / 2) + (11 * scale_factor), 10 * scale_factor, 0.5 * Math.PI - 0.775, 0.5 * Math.PI + 0.775)
// lower D
// draw_3d_arc(0, (pitch_height / 2) - (11 * scale_factor), 10 * scale_factor, 1.5 * Math.PI - 0.775, 1.5 * Math.PI + 0.775)
// draw players

function draw_player(player, size = 30, gk = false) {
    const p = project(rotate(player.coords, ANGLE));
    const boxWidth = 80;
    const boxHeight = 18;

    // --- 1. DRAW THE SHIRT ICON ---
    ctx.save();
    ctx.translate(p.x, p.y); // Move to player's projected position

    // Shirt styling
    ctx.fillStyle = gk ? "#d3e73c" : "#00bfff";
    ctx.strokeStyle = gk ? "#000000" : "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";

    // Draw the Shirt Outline
    // We use 'size' to keep it proportional
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s);      // Left Neck
    ctx.lineTo(-s, -s * 0.8);      // Top Left Shoulder
    ctx.lineTo(-s * 1.2, -s * 0.2);// Left Sleeve End
    ctx.lineTo(-s * 0.8, 0);       // Left Armpit
    ctx.lineTo(-s * 0.8, s);       // Bottom Left
    ctx.lineTo(s * 0.8, s);        // Bottom Right
    ctx.lineTo(s * 0.8, 0);        // Right Armpit
    ctx.lineTo(s * 1.2, -s * 0.2); // Right Sleeve End
    ctx.lineTo(s, -s * 0.8);       // Top Right Shoulder
    ctx.lineTo(s * 0.4, -s);       // Right Neck
    ctx.quadraticCurveTo(0, -s * 0.7, -s * 0.4, -s); // Neckline curve

    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // --- 2. DRAW THE LABEL BOX ---
    ctx.fillStyle = "rgba(255, 255, 0, 0.9)"; // Semi-transparent yellow
    const text_box_x = p.x - boxWidth / 2;
    const text_box_y = p.y + (size * 0.7); // Shifted slightly for better spacing

    ctx.fillRect(text_box_x, text_box_y, boxWidth, boxHeight);

    // --- 3. DRAW THE TEXT ---
    ctx.fillStyle = "black";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        player.name,
        p.x,
        text_box_y + (boxHeight / 2)
    );
}

const formation = formations["4-3-3"]

formation.forEach((pos, index) => {
    // Get the player name that matches this formation slot
    const player = players[index];

    // Combine the name and the coordinates
    const playerData = {
        name: player.name,
        coords: pos.coords
    };

    // Draw them (index 0 is your GK)
    draw_player(playerData, 30, index === 0);
});

const logo = new Image();
logo.src = '/img/woodley-fc.png';
logo.onload = () => {
    ctx.save();
    // This ignores ALL your translates and scales and goes to the literal top-left
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Re-apply only the DPR so it stays sharp
    ctx.scale(dpr, dpr);

    // Now 800 is the true edge of your CSS box
    ctx.drawImage(logo, 800 - 150, 800 - 150, 100, 100);
    ctx.restore();
}