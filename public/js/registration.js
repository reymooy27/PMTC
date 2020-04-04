// Filepond image post
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
)

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 150,
  imageResizeTargetWidth: 150,
  imageResizeTargetHeight: 150
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