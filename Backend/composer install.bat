cd acomodo

%CD:~0,3%\xampp\php\php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
%CD:~0,3%\xampp\php\php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b361f2085f1f1237b7126d785e826a450292b6cfd1d64d92e6563bbde02') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
%CD:~0,3%\xampp\php\php composer-setup.php
%CD:~0,3%\xampp\php\php -r "unlink('composer-setup.php');"

%CD:~0,3%\xampp\php\php composer.phar install
