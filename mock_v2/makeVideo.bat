ffmpeg -y -r 40 -i D:\Desktop\LMV\input_png\%%d.png -i D:\Desktop\LMV\input_mp3\classical.mp3 -vcodec libx264 -pix_fmt yuv420p -b:a 320K -b:v 25M D:\Desktop\LMV\output_mp4\output.mp4