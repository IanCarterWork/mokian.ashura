
window.$Settings = typeof $Settings == 'object' ? $Settings : {};

    $Settings['App:Title'] = `Hello World`;

    $Settings['View:Boot'] = `Welcome`;

    $Settings['View:Current'] = localStorage.getItem('View:Current')||$Settings['View:Boot']||'Welcome';

    $Settings['View:Path'] = `views/`;

    $Settings['View:Extension'] = '.html';

    $Settings['Http:Host'] = './';

    $Settings['Navigation:UseHash'] = true;


    $Settings['Service:Active:Ui'] = false;

    $Settings['Service:Provider:URL'] = 'https://lintelligent.tv/';

    $Settings['Service:Asset:URL'] = 'https://lintelligent.tv/images/';

    $Settings['Service:Image:Library'] = 'https://lintelligent.tv/images/library/';


export default $Settings;
