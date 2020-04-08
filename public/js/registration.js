// Filepond image post
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginImageValidateSize
)

FilePond.setOptions({
  stylePanelAspectRatio: 120 / 120,
  imageResizeTargetWidth: 120,
  allowImageValidateSize: true,
  imageValidateSizeLabelImageSizeTooBig: 'Gambar Terlalu Besar',
  imageValidateSizeMaxWidth: 640,
  imageValidateSizeMaxHeight: 640
})

FilePond.parse(document.body);


const kiri = document.getElementById('registrationForm');
const tName = document.getElementById('namaTeam')

async function getParticipants() {
  await fetch("http://localhost:3000/register")
    .then(a => {
      const part = a.json();
      return part
    })
    .then(participants => {
      participants.forEach(data => {
        kiri.addEventListener('submit', check)
        const y = tName.getAttribute('value')

        function check() {
          if (y === data.teamName) {
            console.log('sama');
          }
        }

      })
    });
}


getParticipants();