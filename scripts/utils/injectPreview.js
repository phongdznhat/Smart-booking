const fs = require('fs');

const scriptContent = `
    <script>
      const fileInput = document.getElementById('resource-image');
      const fileDrop = document.getElementById('fileDrop');
      const filePlaceholder = document.getElementById('filePlaceholder');
      let filePreview = document.getElementById('filePreview');
      
      if (fileInput && fileDrop) {
        // Create preview element if not exists
        if (!filePreview) {
          filePreview = document.createElement('div');
          filePreview.id = 'filePreview';
          filePreview.className = 'file-upload__preview hidden';
          filePreview.innerHTML = \`
            <span class="file-upload__preview-badge">Ảnh mới</span>
            <img id="previewImg" src="" alt="Preview">
            <div class="file-upload__overlay">
              <span class="file-upload__change">
                <svg class="ico ico--sm"><use href="#i-refresh"></use></svg>
                Đổi ảnh khác
              </span>
            </div>
            <button type="button" class="file-upload__remove" id="removeFileBtn" aria-label="Xóa ảnh">
              <svg class="ico"><use href="#i-x"></use></svg>
            </button>
          \`;
          fileDrop.appendChild(filePreview);
        }

        const previewImg = document.getElementById('previewImg');
        const removeFileBtn = document.getElementById('removeFileBtn');

        fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
              if(filePlaceholder) filePlaceholder.classList.add('hidden');
              if(filePreview) {
                filePreview.classList.remove('hidden');
                if(previewImg) previewImg.src = e.target.result;
              }
            }
            reader.readAsDataURL(this.files[0]);
          } else {
            resetPreview();
          }
        });

        if(removeFileBtn) {
          removeFileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            resetPreview();
          });
        }

        function resetPreview() {
          fileInput.value = '';
          if(filePlaceholder) filePlaceholder.classList.remove('hidden');
          if(filePreview) filePreview.classList.add('hidden');
          if(previewImg) previewImg.src = '';
        }
      }
    </script>
  </body>
`;

function injectScript(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('fileInput.addEventListener')) {
    content = content.replace(/<\/body>/, scriptContent);
    fs.writeFileSync(file, content);
  }
}

injectScript('src/view/resourceCreate.ejs');
injectScript('src/view/resourceEdit.ejs');
console.log('Injected successfully.');
