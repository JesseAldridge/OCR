# it helps if you make the text bigger
ls test-images/*.png | xargs -I {} tesseract -l eng -c preserve_interword_spaces=1 {} {}
