
# Configuration du réseau suivant :

![reseau](./img/reseau-formation.lab.png)

------------------

## CSW-01
```matlab

enable 
conf t
hostname CSW-01
no ip domain-lookup

ip routing

! -- creation des VLANs et initialisation du service VTP --

vlan 1 
name IT 
! Pas moyen de changer le nom de la vlan native 
vlan 20 
name SERVER
vlan 30 
name PROD

exit 

vtp domain formation
! vtp password 
vtp mode server

! -- configuration d'une ACL nommée --

ip access-list extended IT-PROD
permit tcp any 10.1.1.0 0.0.0.255 established 
permit udp any any eq 67
permit udp any any eq 68
! a vérifier niveau sécu pour les permit udp!

exit

! -- configuration des interfaces virtuelles --

interface vlan 1
    ip add 10.1.1.254 255.255.255.0
    ip access-group IT-PROD in
    ip helper-address 10.1.20.11
    no shut

interface vlan 20
    ip add 10.1.20.254 255.255.255.0
    ip helper-address 10.1.20.11
    no shut

interface vlan 30 
    ip add 10.1.30.254 255.255.255.0
    ip helper-address 10.1.20.11
    no shut

! -- configuration des interfaces physique -- 

interface range f1/10 - 12
    switchport mode access
    switchport access vlan 20
    no shut

interface F1/1
    switchport trunk native vlan 1
    switchport trunk encapsulation dot1q
    switchport mode trunk
    no shut

interface F1/15
    description to RT-01
    no switchport
    ip add 10.1.0.253 255.255.255.0
    no shut

exit

! -- configuration du routage IP --

router ospf 1
    network 10.1.0.0 0.0.0.255 area 0
    network 10.1.1.0 0.0.0.255 area 0
    network 10.1.20.0 0.0.0.255 area 0
    network 10.1.30.0 0.0.0.255 area 0
    passive-interface f1/10
    passive-interface f1/11
    passive-interface f1/12
    passive-interface f1/1

exit

! -- sécurisation et accès SSH -- 

enable secret cisco
line console 0 
password class
login
line vty 0 15
password class
login

exit

service password-encryption

ip domain-name formation.lab
username cisco password class
crypto key generate rsa 
1024
access-list 2 permit 10.1.1.0 0.0.0.255

line vty 0 15
transport input ssh
login local
access-class 2 in 

! -- enregistrement des données dans le fichier de démarrage -- 

copy run start
```

## SW-01
```matlab
en
conf t
hostname SW-01
no ip domain-lookup

! -- Initialisation du service VTP --

vtp domain formation
vtp mode client

! -- configuration des interfaces physique -- 

int F1/15
    switchport trunk native vlan 1
    switchport mode trunk
    no shut

int F1/1
    switchport mode access
    switchport access vlan 1
    no shut

int range F1/2 - 3
    switchport mode access
    switchport access vlan 30
    no shut

! -- configuration de l'adresse ip du Switch --
int vlan 1
    ip add 10.1.1.241 255.255.255.0
    no shut
exit 
ip default-gateway 10.1.1.254


! -- sécurisation et accès SSH --

enable secret cisco
line console 0 
password class
login
line vty 0 15
password class
login

exit

service password-encryption

ip domaine-name formation.lab
username cisco password class
crypto key generate rsa
1024
access-list 2 permit 10.1.1.0 0.0.0.255

line vty 0 15
transport input ssh
login local
access-class 2 in 

! -- enregistrement des données dans le fichier de démarrage -- 

copy run start
```

## RT-01 
```matlab
enable 
conf t
hostname RT-01
no ip domain-lookup

! -- configuration des interfaces physique -- 

int F0/1
    ip add dhcp
    ip nat outside
    no shut

int F0/0
    description to CSW-01
    ip add 10.1.0.254 255.255.255.0
    ip nat inside
    no shut

exit

! -- configuration du routage IP et de la NAT--

router ospf 1
    network 10.1.0.0 0.0.0.255 area 0
    passive-interface F0/1
    default-information originate
    redistribute static

exit

access-list 1 permit 10.1.0.0 0.0.255.255
ip nat inside source list 1 interface f0/1 overload

! -- sécurisation et accès SSH --

enable secret cisco
line console 0 
password class
login
line vty 0 4
password class
login

exit

service password-encryption

ip domaine-name formation.lab
username cisco password class
crypto key generate rsa
1024
access-list 2 permit 10.1.1.0 0.0.0.255

line vty 0 4
transport input ssh
login local
access-class 2 in 

! -- enregistrement des données dans le fichier de démarrage -- 

copy run start
```

## SRV-01

:file_folder: `interfaces`
```matlab
auto eth0
iface eth0 inet static
    address 10.1.20.11
    netmask 255.255.255.0
    gateway 10.1.20.254
    up echo nameserver 10.1.20.11 > /etc/resolv.conf
```

### Service DHCP:

:file_folder: `etc/default/isc-dhcp-server`
```matlab
DHCPD_CONF=/etc/dhcp/dhcpd.conf
INTERFACES="eth0"
```

:file_folder: `etc/dhcp/dhcpd.conf`
```matlab
server-name "SRV-01";
option domain-name "formation.lab";
option domain-name-servers 10.1.20.11;

default-lease-time 3600;
max-lease-time 7200;

ddns-updates off;
ddns-update-style standard;
include "/etc/dhcp/rndc-keys/rndc.key";

authoritative;

zone formation.lab. {
primary 10.1.20.11;
key rndc-key;
}

zone 1.10.in-addr.arpa. {
primary 10.1.20.11;
key rndc-key;
}

subnet 10.1.1.0 netmask 255.255.255.0 {
    range 10.1.1.51 10.1.1.99;  
    option routers 10.1.1.254;
    option broadcast-address 10.1.1.255;
}

subnet 10.1.20.0 netmask 255.255.255.0 {
    deny unkown-clients;
    range 10.1.20.51 10.1.20.99;  	
    option routers 10.1.20.254;
    option broadcast-address 10.1.20.255;
}

subnet 10.1.30.0 netmask 255.255.255.0 {
    range 10.1.30.51 10.1.30.99;  
    option routers 10.1.30.254;
    option broadcast-address 10.1.30.255;
}
```
:rocket: `service isc-dhcp-server start`

### Service DNS: 
https://www.digitalocean.com/community/tutorials/how-to-configure-bind-as-a-private-network-dns-server-on-ubuntu-14-04

:file_folder: `etc/default/bind9`
```matlab 
RESOLVCONF=no;
OPTIONS="-4 -u bind"
```
#### Fichiers de configs

:file_folder: `etc/bind/named.conf.options`
```matlab 
 acl localnet {   
  127.0.0.1;  
  1.10.0.0/16;  
 }; 

options{
    directory "/var/cache/bind";

    recursion yes;
    listen-on { 10.1.20.11; };
    allow-recursion { localnet; };
    allow-query { localnet;};
    allow-query-cache { localnet;}; 

    //forwarders {
    //    8.8.8.8;
    //    8.8.4.4:
    //};

    dnssec-validation auto;
    auth-nxdomain no;
}
```

Configuration de la key pour le DNS dynamique: 
> rndc-confgen -a -b 512  
> se trouve dans /etc/bind/rndc.key

:file_folder: `etc/bind/named.conf.local`
```matlab 
key "rndc-key" {
    algorithm hmac-md5;
    secret "CH8OLT6nbRkHyBmD0Pfu798YVArhrIKxK6WSE0aOeoDI96A//Su3aCNSLcx+ubyG0qwQcIPPGvq1pUx1Eglimw==";
}; 

zone "formation.lab" { 
    type master;
    file "/etc/bind/zones/db.formation.lab";
    allow-update {  key rndc-key; };
};

zone "1.1.10.in-addr.arpa" { 
    type master;
    file "/etc/bind/zones/db.1.10.1"; 
    allow-update {  key rndc-key; };
};

zone "20.1.10.in-addr.arpa" { 
    type master;
    file "/etc/bind/zones/db.20.10.1"; 
    allow-update {  key rndc-key; };
};

zone "30.1.10.in-addr.arpa" { 
    type master;
    file "/etc/bind/zones/db.30.10.1"; 
    allow-update {  key rndc-key; };
};

zone "0.1.10.in-addr.arpa" { 
    type master;
    file "/etc/bind/zones/db.0.10.1"; 
    allow-update {  key rndc-key; };
};
```

#### Fichiers de zones

:file_folder: `etc/bind/zones/db.formation.lab`
```matlab 
$TTL    86400
@       IN      SOA     SRV-01.formation.lab. admin.SRV-01.formation.lab. (
                  1     ; Serial
             604800     ; Refresh
              86400     ; Retry
            2419200     ; Expire
              86400 )   ; Negative Cache TTL
;
;NS records
     IN      NS      SRV-01.formation.lab.

;A records
SRV-01.formation.lab.         IN      A       10.1.20.11
MS-01.formation.lab.          IN      A       10.1.20.12
NT-01.formation.lab.          IN      A       10.1.20.10
SW-01.formation.lab.          IN      A       10.1.1.241
CSW-01.formation.lab.         IN      A       10.1.1.254
RT-01.formation.lab.          IN      A       10.1.0.254

```

:file_folder: `etc/bind/zones/db.0.10.1`
```matlab 
$TTL	86400
$ORIGIN 0.1.10.in-addr.arpa.
@	IN	SOA	SRV-01.formation.lab. admin.SRV-01.formation.lab. (
            1	; Serial
        604800	; Refresh
        86400	; Retry
       2419200	; Expire
        86400 )	; Negative Cache TTL
;
; NS -records
IN	NS	SRV-01.formation.lab.

; A-records
254	IN	PTR	RT-01.formation.lab.
```

:file_folder: `etc/bind/zones/db.1.10.1`
```matlab 
$TTL	86400
$ORIGIN 1.1.10.in-addr.arpa.
@	IN	SOA	SRV-01.formation.lab. admin.SRV-01.formation.lab. (
            1	; Serial
        604800	; Refresh
        86400	; Retry
       2419200	; Expire
        86400 )	; Negative Cache TTL
;
; NS -records
IN	NS	SRV-01.formation.lab.

; A-records
241	IN	PTR	SW-01.formation.lab.
254	IN	PTR	CSW-01.formation.lab.
```

:file_folder: `etc/bind/zones/db.20.10.1`
```matlab 
$TTL	86400
$ORIGIN 20.1.10.in-addr.arpa.
@	IN	SOA	SRV-01.formation.lab. admin.SRV-01.formation.lab. (
            1	; Serial
        604800	; Refresh
        86400	; Retry
       2419200	; Expire
        86400 )	; Negative Cache TTL
;
; NS -records
IN	NS	SRV-01.formation.lab.

; A-records
11	IN	PTR	SRV-01.formation.lab.
12	IN	PTR	MS-01.formation.lab.	
10	IN	PTR	NT-01.formation.lab.

```

:file_folder: `etc/bind/zones/db.30.10.1`
```matlab 
$TTL	86400
$ORIGIN 30.1.10.in-addr.arpa.
@	IN	SOA	SRV-01.formation.lab. admin.SRV-01.formation.lab. (
            1	; Serial
        604800	; Refresh
        86400	; Retry
       2419200	; Expire
        86400 )	; Negative Cache TTL
;
; NS -records
IN	NS	SRV-01.formation.lab.

; A-records
```

> chmod 664 /etc/bind/zones/db.1.10 && chmod 664 /etc/bind/zones/db.formation.lab

:rocket: `service bind9 start`

## MS-01
:file_folder: `interfaces`
```matlab
auto eth0
iface eth0 inet static
    address 10.1.20.12
    netmask 255.255.255.0
    gateway 10.1.20.254
    up echo nameserver 10.1.20.11 > /etc/resolv.conf
```

## NT-01
NE VEUT PAS BOOTER ! 
