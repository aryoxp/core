$(() => {

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function demo(ajax) {
    for(let i = 1; i <= 1500; i++) {
      ajax.get(`m/x/mta/dataApi/test/${i}`).then(result => { 
        console.log(result);
        // $('#test-result').html(result);
      }, err => console.error(err));
      await sleep(100);
    }
  }

  async function demoCompressed(ajax) {
    for(let i = 1; i <= 1500; i++) {
      ajax.get(`m/x/mta/dataApi/testCompressed/${i}`).then(result => { 
        console.log(result);
        // $('#test-result').html(result);
      }, err => console.error(err));
      await sleep(100);
    }
  }

  async function demoAll(ajax) {
    $('#test-result').html('');
    for(let i = 1; i <= 1500; i++) {
      ajax.get(`m/x/mta/dataApi/testAll/${i}`).then(result => { 
        let ram = performance.memory.usedJSHeapSize;
        let startTime = performance.now();
        let decoded = Core.decompress(result.compressed);
        let decompressTime = performance.now();
        let mem = performance.memory.usedJSHeapSize - ram;
        try {
          gc();
        } catch(e) {
          
        }
        let row = '<tr>';
          row += `<td>${result.durationJson} ms</td>`
          row += `<td>${result.durationCompressing} ms</td>`
          row += `<td>${result.lengthJson}</td>`
          row += `<td>${result.lengthCompressed} - ${(parseInt(result.lengthCompressed/result.lengthJson*10000)/100)}%</td>`
          row += `<td>${result.memJson}</td>`
          row += `<td>${result.memCompressed}</td>`
          row += `<td>${result.memCompressing/1024} kB</td>`
          row += `<td>${parseInt((decompressTime - startTime)*1000)/1000} ms</td>`
          row += `<td>${parseInt(mem*1000/1024)/1000} kB</td>`
          row += '</tr>'
        $('#test-body').append(row);

        // ProfilerAgent.collectGarbage();
      }, err => console.error(err));
      await sleep(100);
    }
  }

  $('#btn-begin-test').on('click', () => {
    let ajax = Core.instance().ajax();
    demo(ajax);
  });

  $('#btn-begin-test-compressed').on('click', () => {
    let ajax = Core.instance().ajax();
    demoCompressed(ajax);
  });

  $('#btn-begin-test-all').on('click', () => {
    let ajax = Core.instance().ajax();
    demoAll(ajax);
  });

});