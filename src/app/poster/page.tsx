"use client";

import { AddOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Picture = () => {
  const [uplaoding, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [starring, setStarring] = useState("");
  const [music, setMusic] = useState("");
  const [colorPicker, setColorPicker] = useState("#faf4e6");
  const canvas = useRef<HTMLCanvasElement>(null);
  const secondCanvas = useRef<HTMLCanvasElement>(null);

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { data } = await axios.post("/api", formData);
      setUploadedImage(data.filename);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  useEffect(() => {
    const posterImage = new Image();
    posterImage.src = uploadedImage ? uploadedImage : "/batman.jpeg";
    posterImage.onload = () => setImage(posterImage);
  }, [uploadedImage, uplaoding]);

  useEffect(() => {
    if (canvas && image && secondCanvas) {
      const current = canvas.current as HTMLCanvasElement;
      const ctx = current.getContext("2d") as CanvasRenderingContext2D;

      const wrapText = (
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const words = text.split(" ");
        let line = "";

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      };

      ctx.fillStyle = colorPicker;
      ctx.fillRect(0, 0, current.width, current.height);
      ctx.drawImage(image, 100, 150, 500, 600);

      ctx.font = "60px Roboto";
      ctx.fillStyle = "black";
      ctx.direction = "ltr";

      ctx.fillText(title, 100, 130);

      ctx.font = "40px Roboto";
      ctx.fillText(year, 525, 60);

      ctx.font = "16px Roboto";
      director && ctx.fillText("Directed By: ", 100, current.height - 120);
      ctx.fillText(director, 190, current.height - 120);

      ctx.font = "11px Roboto";
      wrapText(ctx, synopsis, 320, current.height - 120, 300, 15);
      starring && ctx.fillText("Starring: ", 100, current.height - 100);
      ctx.fillText(starring, 150, current.height - 100);
      ctx.fillText(music, 100, current.height - 80);
    }
  }, [
    image,
    canvas,
    title,
    director,
    colorPicker,
    secondCanvas,
    year,
    synopsis,
    starring,
    music,
  ]);

  return (
    <main className="bg-white flex justify-around w-full items-center h-screen">
      <canvas id="canvas" ref={canvas} width={700} height={900}></canvas>

      <div className="w-[600px]">
        <p className="text-3xl mb-3 font-extrabold">Customize Movie Poster</p>
        <div className="mb-8">
          <p className="text-xl mb-3 font-extrabold">Upload Artwork:</p>

          <div className="flex justify-around items-end">
            <label>
              <input
                type="file"
                hidden
                onChange={({ target }) => {
                  if (target.files) {
                    const file = target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                  }
                }}
              />
              <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed border-blue-600 cursor-pointer">
                {selectedImage ? (
                  <img src={selectedImage} alt="Poster" />
                ) : (
                  <AddOutlined fontSize="large" color="primary" />
                )}
              </div>
            </label>

            <button
              type="button"
              disabled={uplaoding}
              onClick={handleUpload}
              className={`bg-blue-600 p-3 w-32 text-center h-min rounded-lg text-white ${
                uplaoding ? "opacity-50" : "opacity-100"
              }`}
            >
              {uplaoding ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <div className="w-[400px]">
          <p className="text-xl mb-3 font-extrabold">Enter Text:</p>

          <TextField
            type="text"
            name="title"
            variant="outlined"
            value={title}
            placeholder="Blade Runner"
            label="Enter Movie Title"
            onChange={(e) => setTitle(e.target.value)}
            className="!mb-4"
            fullWidth
          />
          <TextField
            type="text"
            name="direcor"
            variant="outlined"
            value={director}
            label="Enter Movie Director"
            placeholder="Luke Scott"
            onChange={(e) => setDirector(e.target.value)}
            className="!mb-4"
            fullWidth
          />

          <TextField
            type="text"
            name="year"
            variant="outlined"
            value={year}
            label="Enter Release Year"
            placeholder="2023"
            onChange={(e) => setYear(e.target.value)}
            className="!mb-4"
            fullWidth
          />

          <TextField
            type="text"
            name="starring"
            variant="outlined"
            value={starring}
            label="Enter Names of actors/actress"
            placeholder="Ryan Gosling, Ana de armas"
            onChange={(e) => setStarring(e.target.value)}
            className="!mb-4"
            fullWidth
          />

          <TextField
            type="text"
            name="music"
            variant="outlined"
            value={music}
            label="You Choose, eg. Music by..."
            placeholder="Music By: Bek"
            onChange={(e) => setMusic(e.target.value)}
            className="!mb-4"
            fullWidth
          />

          <TextField
            name="synopsis"
            variant="outlined"
            multiline
            rows={5}
            value={synopsis}
            label="Enter Movie Synopsis"
            placeholder="Deckard (Harrison Ford) is forced by the police Boss (M. Emmet Walsh) to continue his old job as Replicant Hunter. His assignment: eliminate four escaped Replicants from the colonies who have returned to Earth. Before starting the job, Deckard goes to the Tyrell Corporation and he meets Rachel (Sean Young), a Replicant girl he falls in love with."
            onChange={(e) => setSynopsis(e.target.value)}
            className="!mb-4"
            fullWidth
          />
        </div>

        <div>
          <p className="text-xl mb-3 font-extrabold">Select Colors:</p>
          <div className="flex items-center gap-4">
            <label htmlFor="colorPicker" className="text-xl">
              Background
            </label>
            <input
              id="colorPicker"
              type="color"
              name="colorPicker"
              value={colorPicker}
              onChange={(e) => setColorPicker(e.target.value)}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Picture;
