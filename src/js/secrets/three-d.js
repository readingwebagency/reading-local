const canvas = document.getElementById("game");
canvas.width = 800;
canvas.height = 800;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "green";

// 1. PITCH
pitch_unit_width = 70;
pitch_unit_height = 110;
scale_factor = 4
pitch_width = scale_factor * pitch_unit_width;
pitch_height = scale_factor * pitch_unit_height;
starting_coord = { x: 100, y: 100 }

ctx.beginPath();
ctx.moveTo(starting_coord.x, starting_coord.y);
ctx.lineTo(starting_coord.x + pitch_width, starting_coord.y);
ctx.lineTo(starting_coord.x + pitch_width, starting_coord.y + pitch_height);
ctx.lineTo(starting_coord.x, starting_coord.y + pitch_height);
ctx.lineTo(starting_coord.x, starting_coord.y);
ctx.stroke();

function draw_box(width, height, is_upper=TRUE) {
    const y_direction = is_upper ? 1 : -1
    starting_x = starting_coord.x + (pitch_width / 2) - (width / 2);
    starting_y = is_upper ? starting_coord.y : starting_coord.y + pitch_height;

    ctx.beginPath();
    ctx.moveTo(starting_x, starting_y);
    ctx.lineTo(starting_x, starting_y + height * y_direction);
    ctx.lineTo(starting_x + width, starting_y + height * y_direction)
    ctx.lineTo(starting_x + width, starting_y)
    ctx.stroke();
}

// 2. GOAL AREA (aka 6 yard box)
draw_box(20 * scale_factor, 6 * scale_factor, is_upper=true);
draw_box(20 * scale_factor, 6 * scale_factor, is_upper=false);
// 3. PENALTY BOX (aka 18 yard box)
draw_box(44 * scale_factor, 18 * scale_factor, is_upper=true);
draw_box(44 * scale_factor, 18 * scale_factor, is_upper=false);
// 3b. PENALTY BOX arcs
// upper arc
ctx.beginPath();
ctx.arc(starting_coord.x + pitch_width / 2, starting_coord.y + 11 * scale_factor, 10 * scale_factor, 0.5 * Math.PI - 0.775, 0.5 * Math.PI + 0.775);
ctx.stroke();
//upper arc 
ctx.beginPath();
ctx.arc(starting_coord.x + pitch_width / 2, starting_coord.y + pitch_height - 11 * scale_factor, 10 * scale_factor, 1.5 * Math.PI - 0.775, 1.5 * Math.PI + 0.775);
ctx.stroke();

//4. HALFWAY LINE
ctx.moveTo(starting_coord.x, starting_coord.y + pitch_height / 2);
ctx.lineTo(starting_coord.x + pitch_width, starting_coord.y + pitch_height / 2);
ctx.stroke();
//5. CIRCLE
ctx.beginPath();
ctx.arc(starting_coord.x + pitch_width / 2, starting_coord.y + pitch_height / 2, 10 * scale_factor, 0, 2 * Math.PI);
ctx.stroke();
