# LABO 10 config

## RT-01

```
enable 
conf t
hostname RT-01
no ip domain-lookup
ip domain-name Formation.lab

! -- configuration des interfaces physique --

int F0/0
ip address 10.1.1.254 255.255.255.0
ip nat inside
no shut

int F0/1
ip add dhcp 
ip nat outside 
no shut 

ip dhcp pool Pool1
    network 10.1.1.0 255.255.255.0
    default-router 10.1.1.254
    dns-server 8.8.8.8
    domain-name Formation.lab

access-list 1 permit 10.1.1.0 0.0.0.255
ip nat inside source list 1 interface f0/1 overload
```

## DHCP-Rogue

```bash
#Static config for eth0
auto eth0
iface eth0 inet static
	address 10.1.1.100
	netmask 255.255.255.0
	gateway 10.1.1.254
#
```

## RED ET IT-01

dans edit config décocher les 2 dernières lignes

---

# Explications cache poisoning

- Quand on est dans un réseau local au lieu d’utiliser des adresse ip, on utilise la MAC adresse
- Chaque carte réseau a une adresse MAC qui lui appartient

=> quand on est dans un même LAN, on communique à partir d’un adresse MAC

=> pour récupérer la MAC on passe par l’IP

=> on envoie une requête arp à toutes les machines avec l’adresse de broadcast

=> si une machine qui reçoit la requête connait la réponse alors elle renvoie la réponse (ISAT) à celui qui l’a demandée.

- Cache poisoning

⇒ au lieu de faire une requete who is ? le pirate fait un ISAT 

⇒ il donne sa MAC au lieu de celle de la bonne machine comme ça il intercepte toutes les données

⇒ on empoisonne le cache des machines en donnant des fausses infomations

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/11f36a71-01cd-476f-9a19-fb38b77d6da3/Unknown.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/11f36a71-01cd-476f-9a19-fb38b77d6da3/Unknown.jpeg)
