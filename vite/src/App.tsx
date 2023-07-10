import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

$(document).ready(function() {
  var containerWidth = $(window).width(); // Width of the container element (e.g., the window)
  var containerHeight = $(window).height(); // Height of the container element

  var radius = Math.min(containerWidth, containerHeight) / 2; // Radius of the circle

  var stickers = $('.sticker'); // Select all the sticker elements

  var angle = (2 * Math.PI) / stickers.length; // Calculate the angle between stickers

  stickers.each(function(index) {
    var currentAngle = index * angle;

    var xPos = containerWidth / 2 + radius * Math.cos(currentAngle) - $(this).width() / 2;
    var yPos = containerHeight / 2 + radius * Math.sin(currentAngle) - $(this).height() / 2;

    $(this).css({
      left: xPos,
      top: yPos
    });
  });
});


export default App
